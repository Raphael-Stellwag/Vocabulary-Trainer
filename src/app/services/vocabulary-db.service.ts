import { Action } from '../interfaces/action';
import { Injectable } from '@angular/core';
import { ClasOption, IVocabulary, UnitOption, Vocabulary } from '../interfaces/vocabulary';
import { VocabularyRestService } from './vocabulary-rest.service';
import { ActionMethod } from '../interfaces/action';
import { DbFunctionService } from './db-function.service';
import { LocalStorageNamespace } from './local-storage.namespace';


@Injectable({
  providedIn: 'root'
})
export class VocabularyDbService {

  constructor(private dbFunctions: DbFunctionService) {
  }

  async addVocabulary(voc: IVocabulary) {
    voc.id = LocalStorageNamespace.getNextPrimaryId();
    return await this.dbFunctions.insertVocabularyJustDb(voc).catch(err => {
      console.error(err);
      throw new Error(err);
    });
  }

  //By Bulk Insert First perform all Inserts locally and then push the actions with one request to the server
  async addBulkVocabulary(vocs: Vocabulary[]) {
    const dbResults: IVocabulary[] = [];
    for (let i = 0; i < vocs.length; i++) {
      const voc = vocs[i];
      voc.id = LocalStorageNamespace.getNextPrimaryId();
      const result = await this.dbFunctions.insertVocabularyJustDb(voc).catch(err => {
        console.error('Error at the dbFunctions.insertVocabularyJustDb during bulk insert' , err);
        throw new Error(err);
      });
      dbResults.push(result[0] as IVocabulary);
    }
    return dbResults;
  }

  async editVocabulary(voc: Vocabulary): Promise<Action> {
    const oldresult = await this.getVocabularybyId(voc.id);
    console.log('oldResult', oldresult[0]);
    this.dbFunctions.updateVocabularyJustDb(voc).catch(err => {
      console.error(err);
      throw new Error(err);
    });
    return new Action(null, ActionMethod.UPDATE, oldresult[0] as IVocabulary, voc);
  }

  async deleteVocabulary(voc: Vocabulary) {
    await this.dbFunctions.deleteVocabularyJustDb(voc);
  }

  getClases(): Promise<ClasOption[]> {
    return this.dbFunctions.getClases();
  }

  getUnits(clas: string): Promise<UnitOption[]> {
    return this.dbFunctions.getUnits(clas);
  }

  getVocabularybyId(id: number): Promise<unknown[]> {
    return this.dbFunctions.getVocabularybyId(id);
  }

  getAllVocs(): Promise<any> {
    return this.dbFunctions.getAllVocs();
  }

  getVocsFromOneUnit(clas: string, unit: string): Promise<any> {
    return this.dbFunctions.getVocsFromOneUnit(clas, unit);
  }

  getVocsFromOneClas(clas: string): Promise<any> {
    return this.dbFunctions.getVocsFromOneClas(clas);
  }

  getAllVocsCount(): Promise<number> {
    return this.dbFunctions.getAllVocsCount();
  }

}
