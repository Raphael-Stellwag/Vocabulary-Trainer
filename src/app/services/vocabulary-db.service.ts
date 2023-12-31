import { Action } from '../interfaces/action';
import { Injectable } from '@angular/core';
import { ClassOption, IVocabulary, UnitOption, Vocabulary } from '../interfaces/vocabulary';
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
    return await this.dbFunctions.insertVocabularyJustDb(voc).catch(err => {
      console.error(err);
      throw new Error(err);
    });
  }

  // By Bulk Insert First perform all Inserts locally and then push the actions with one request to the server
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

  async editVocabulary(voc: Vocabulary) {
    return await this.dbFunctions.updateVocabularyJustDb(voc).catch(err => {
      console.error(err);
      throw new Error(err);
    });
  }

  async deleteVocabulary(voc: Vocabulary) {
    await this.dbFunctions.deleteVocabularyJustDb(voc);
  }

  getClasses(): Promise<ClassOption[]> {
    return this.dbFunctions.getClasses();
  }

  getUnits(class_: string): Promise<UnitOption[]> {
    return this.dbFunctions.getUnits(class_);
  }

  getVocabularybyId(id: number): Promise<unknown[]> {
    return this.dbFunctions.getVocabularybyId(id);
  }

  getAllVocs(): Promise<any> {
    return this.dbFunctions.getAllVocs();
  }

  getVocsFromOneUnit(class_: string, unit: string): Promise<any> {
    return this.dbFunctions.getVocsFromOneUnit(class_, unit);
  }

  getVocsFromOneClass(class_: string): Promise<any> {
    return this.dbFunctions.getVocsFromOneClass(class_);
  }

  getAllVocsCount(): Promise<number> {
    return this.dbFunctions.getAllVocsCount();
  }

}
