import { InternetConnectionService } from './internet-connection.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import {  IVocabulary } from '../interfaces/vocabulary';
import { LocalStorageNamespace } from './local-storage.namespace';
import { environment } from 'src/environments/environment';
import { IAction, Action, ActionMethod } from '../interfaces/action';
import { DbFunctionService } from './db-function.service';


@Injectable({
  providedIn: 'root'
})
export class VocabularyRestService {

  constructor(private httpClient: HttpClient, private auth: AuthService, private dbFunctions: DbFunctionService, private internetConnection: InternetConnectionService) { }

  async sync () {
    if (this.auth.isLoggedIn() && this.internetConnection.isConnected()) {
      return await this.handleServiceStart();
    } else {
      console.log('No internet or not logged in');
    }
  }

  private handleServiceStart() {
    const _this = this;
    return new Promise(function(resolve, reject) {
      _this.getNewActions().subscribe((result: any) => {
        console.log('result', result);
        if (result.length > 0) {
          _this.syncLocal(result as IAction[]).then(res =>
            resolve(res)
          ).catch(err => {
            console.error(err);
            reject(err); }
          );
        } else if (LocalStorageNamespace.getLocalSavedActions().length > 0) {
          _this.postLocalActions(LocalStorageNamespace.getLocalSavedActions()).then(res =>
            resolve(res)
          ).catch(err => {
            console.error(err);
            reject(err)
          });
        } else {
          resolve(""); //TODO: Fix ""
        }
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  private syncLocal(serverActions: IAction[]): Promise<any> {
    const local: IAction[] = LocalStorageNamespace.getLocalSavedActions();
    return this.performReverseLocalActions(local, serverActions);
  }

  private performReverseLocalActions(local: Action[], serverActions: Action[]) : Promise<any> {
    //console.log(index);
    if (local.length > 0) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        let countFinished = 0;
        for(let index = local.length -1; index >= 0; index--) {
          const element = local[index];
          _this.performReverseAction(element, element.method).finally(function() {
            countFinished++;
            if (countFinished == local.length) {
              _this.performServerActions(local, serverActions).then(res =>
                resolve(res)
              ).catch(err => {
                console.error(err);
                reject(err)
              });
            }
          })

        }
      })

    } else {
      return this.performServerActions(local, serverActions);
    }
  }

  private performServerActions(local: Action[], serverActions: Action[]): Promise<any> {
    let _this = this;
    return new Promise((resolve, reject) => {
      let countFinished = 0;
      for(let index = 0; index < serverActions.length; index++) {
        const element = serverActions[index] = Action.deserializeVocabularies(serverActions[index])

        // After a DELETE no local action is possible on that vocabulary
        if (element.method == ActionMethod.DELETE) {
          let idToDelete = element.vocabularyBeforeAction.id;
          //Was just created from server
          let justCreated = false;
          for(let innerIndex = 0; innerIndex < index; innerIndex++) {
            if (serverActions[innerIndex].method == ActionMethod.ADD && serverActions[innerIndex].vocabularyAfterAction.id == idToDelete) {
              justCreated = true;
              innerIndex = index;
            }
          }
          if (!justCreated) {
            for(let innerIndex = 0; innerIndex < local.length; innerIndex++) {
              if (local[innerIndex].vocabularyAfterAction != null && local[innerIndex].vocabularyAfterAction.id == idToDelete) {
                local.splice(innerIndex, 1);

                // Can there be any further actions --> after delete no furter action posssible
                if (local[innerIndex].method == ActionMethod.DELETE) {
                  innerIndex = local.length;
                }
              }
            }
          }
        }

        this.performAction(element, element.method).finally(function() {
          countFinished++;
          if (countFinished == serverActions.length) {
            LocalStorageNamespace.addCountSynchronizedActions(serverActions.length);

            _this.performLocalActionsAndPushThem(local).then(res =>
              resolve(res)
            ).catch(err => {
              console.error(err);
              reject(err)
            });
          }
        })

      }
    })
  }

  private async performLocalActionsAndPushThem(local: Action[]): Promise<any> {
    let localActionsReadyToPush = [];
    let newId = (await this.dbFunctions.getHighestId())[0].id;
    for(let index = 0; index < local.length; index++) {
      const element = local[index];
      if (element.method == ActionMethod.ADD) {
        newId++;
        element.vocabularyAfterAction.id = newId;
      }
      await this.performAction(element, element.method).catch(err => {
        console.log("sdfsdfsdfxc", err);
        throw Error(err);
      });

      if (element.method == ActionMethod.ADD) {
        for (let innerIndex = index; innerIndex < local.length; innerIndex++) {
          const element: IAction = local[innerIndex];
          if (element.vocabularyAfterAction != null) {
            element.vocabularyAfterAction.id = newId;
          }
          if (element.vocabularyBeforeAction != null) {
            element.vocabularyBeforeAction.id = newId;
          }
        }
      }
      localActionsReadyToPush.push(element);
    }
    LocalStorageNamespace.setNextPrimaryId(newId+1);
    return await this.postLocalActions(localActionsReadyToPush);
  }

  private performAction(element:IAction, method: ActionMethod) {
    switch (method) {
      case ActionMethod.ADD:
        return this.dbFunctions.insertVocabularyJustDb(element.vocabularyAfterAction);
        break;
      case ActionMethod.UPDATE:
        return this.dbFunctions.updateVocabularyJustDb(element.vocabularyAfterAction);
        break;
      case ActionMethod.DELETE:
        return this.dbFunctions.deleteVocabularyJustDb(element.vocabularyBeforeAction);
        break;
    }
  }

  private performReverseAction(element:IAction, method: ActionMethod): Promise<any> {
    switch (method) {
      case ActionMethod.ADD:
        return this.dbFunctions.deleteVocabularyJustDb(element.vocabularyAfterAction);
        break;
      case ActionMethod.UPDATE:
        return this.dbFunctions.updateVocabularyJustDb(element.vocabularyBeforeAction);
        break;
      case ActionMethod.DELETE:
        return this.dbFunctions.insertVocabularyJustDb(element.vocabularyBeforeAction);
        break;
    }
  }

  private getNewActions() {
    return this.httpClient.get(environment.vocabulary_server.URL + "?count-synchronised-actions=" + LocalStorageNamespace.getCountSynchronisedActions()/*, this.customHttpHeader()*/);
  }

  private postLocalActions(actions: IAction[]) {
    let resolveIt, rejectIt;
    let promise = new Promise(function(resolve, reject) {
      resolveIt = resolve; rejectIt = reject;
    });
    console.log(JSON.stringify(actions));
    this.httpClient.post(environment.vocabulary_server.URL + "?count-synchronised-actions=" + LocalStorageNamespace.getCountSynchronisedActions(), JSON.stringify(actions)/*, this.customHttpHeader()*/).subscribe((result:any) => {
      console.log(result);

      if(result.status === "ok") {
        LocalStorageNamespace.addCountSynchronizedActions(actions.length);
        LocalStorageNamespace.deleteLocalSavedActions();
      } else {
        LocalStorageNamespace.setLocalSavedActions(actions);
      }
      resolveIt(result);
    }, err => {
      console.log(err);
      LocalStorageNamespace.setLocalSavedActions(actions);
      rejectIt(err);
    })

    return promise;
  }

  postAction(method: ActionMethod, vocBeforeAction: IVocabulary, vocAfterAction: IVocabulary) {
    this.saveActionForLaterPush(method, vocBeforeAction, vocAfterAction);
    if (this.auth.isLoggedIn() && this.internetConnection.isConnected()) {
      console.log("authenticated");
      this.sync();
    } else {
      if (this.internetConnection.isConnected() == false) {
        console.log("No Internet");
      } else {
        console.log("Not authenticated");
      }
    }
  }

  private getIdForNewAction(actions: IAction[]) {
    let newId;
    if (actions.length > 0)
      newId = actions[actions.length-1].id+1;
    else
      newId = LocalStorageNamespace.getCountSynchronisedActions();
    return newId;
  }

  saveActionForLaterPush(method: ActionMethod, vocBeforeAction: IVocabulary, vocAfterAction: IVocabulary) {
    let actions: IAction[] = LocalStorageNamespace.getLocalSavedActions();
    actions.push(new Action(this.getIdForNewAction(actions), method, vocBeforeAction, vocAfterAction));
    LocalStorageNamespace.setLocalSavedActions(actions);
  }

}
