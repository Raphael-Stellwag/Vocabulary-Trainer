import { VocabularyRestService } from 'src/app/services/vocabulary-rest.service';
import { FilteredDataObject } from '../interfaces/FilteredDataObject';
import { VocabularyDbService } from './vocabulary-db.service';
import { Vocabulary } from '../interfaces/vocabulary';
import { Injectable } from '@angular/core';
import { ActionMethod } from '../interfaces/action';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private currentUsedFilteredDataObject: FilteredDataObject[] = [];

  constructor(private dbService: VocabularyDbService, private restService: VocabularyRestService) { }

  async sync() {
    const result = await this.restService.sync();
    await this.updateCurrentUsedFilteredDataObjects();
    return result;
  }

  async addBulkVocabulary(vocs: Vocabulary[]) {
    const dbResults = await this.dbService.addBulkVocabulary(vocs);
    for (const dbResult of dbResults) {
      this.restService.saveActionForLaterPush(ActionMethod.ADD, null, dbResult);
    }
    await this.restService.sync();
  }

  async getVocabularyCount() {
    return await this.dbService.getAllVocsCount();
  }

  /**
   * Get all Vocabularies for a clas, this array wont be updated automatically as in getAllVocs
   * @param clas Clas to get Vocabularies for
   */
  getVocsFromOneClas(clas: string): Promise<Vocabulary[]> {
    return this.dbService.getVocsFromOneClas(clas);
  }

  /**
   * Get all Vocabularies for a unit, this array wont be updated automatically as in getAllVocs
   * @param clas Clas to get Vocabularies for
   * @param unit unit to get Vocabularies for
   */
  getVocsFromOneUnit(clas: string, unit: string): Promise<Vocabulary[]> {
    return this.dbService.getVocsFromOneUnit(clas, unit);
  }

  async getVocsFromOneUnitWithUpdate(clas: string, unit: string): Promise<FilteredDataObject> {
    const result = await this.dbService.getVocsFromOneUnit(clas, unit);
    const filteredDataObject = new FilteredDataObject();
    console.log(filteredDataObject);
    filteredDataObject.clas = clas;
    filteredDataObject.unit = unit;
    filteredDataObject.data = Vocabulary.createCorrectReferences(result);

    console.log(filteredDataObject);
    console.log(filteredDataObject.data);

    this.currentUsedFilteredDataObject.push(filteredDataObject);
    console.log(filteredDataObject);
    return filteredDataObject;
  }

  async getAllVocsWithUpdates(): Promise<FilteredDataObject> {
    const result = await this.dbService.getAllVocs();
    const filteredDataObject = new FilteredDataObject();
    filteredDataObject.data = Vocabulary.createCorrectReferences(result);
    this.currentUsedFilteredDataObject.push(filteredDataObject);
    return filteredDataObject;
  }

  async addVocabulary(voc: Vocabulary): Promise<any> {
    const result = await this.dbService.addVocabulary(voc);
    this.restService.postAction(ActionMethod.ADD, null, result[0]);
    this.addVocToAllFilteredDataObjects(voc);
    return result;
  }

  async deleteVocabulary(voc: Vocabulary) {
    this.deleteVocFromFilteredDataObjects(voc);
    await this.dbService.deleteVocabulary(voc);
    this.restService.postAction(ActionMethod.DELETE, voc, null);
  }

  async editVocabulary(voc: Vocabulary) {
    const action = await this.dbService.editVocabulary(voc);
    this.restService.postAction(action.method, action.vocabularyBeforeAction, action.vocabularyAfterAction);
    this.editVocInAllFilteredDataObjects(voc);
  }

  public removeFilteredDataObject(obj: FilteredDataObject) {
    if (this.currentUsedFilteredDataObject.includes(obj)) {
      this.currentUsedFilteredDataObject.splice(this.currentUsedFilteredDataObject.indexOf(obj), 1);
    }
  }

  private async updateCurrentUsedFilteredDataObjects() {
    for (const object of this.currentUsedFilteredDataObject) {
      if (object.clas == null && object.unit == null) {
        object.data = await this.dbService.getAllVocs();
      } else if (object.clas != null && object.unit == null) {
        object.data = await this.dbService.getVocsFromOneClas(object.clas);
      } else {
        object.data = await this.dbService.getVocsFromOneUnit(object.clas, object.unit);
      }
    }
  }

  private addVocToAllFilteredDataObjects(voc: Vocabulary) {
    this.currentUsedFilteredDataObject.forEach((object) => {
      if (this.vocFitsFilterOfDataObject(object, voc)) {
        object.data.push(voc);
      }
    });
  }

  private deleteVocFromFilteredDataObjects(voc: Vocabulary) {
    this.currentUsedFilteredDataObject.forEach((object) => {
      if (this.vocFitsFilterOfDataObject(object, voc)) {
        const index = object.data.indexOf(voc);
        if (index > -1) {
          object.data.splice(index, 1);
        }
      }
    });
  }

  private editVocInAllFilteredDataObjects(voc: Vocabulary) {
    this.currentUsedFilteredDataObject.forEach((object) => {
        let toRemove = null;
        object.data.forEach((oldVocData) => {
          if (oldVocData.id === voc.id) {
            if (this.vocFitsFilterOfDataObject(object, voc)) {
              oldVocData = voc;
            } else {
              toRemove = oldVocData;
            }
          }
        });
        if (toRemove != null) {
          object.data.splice(object.data.indexOf(toRemove), 1);
        }
    });
  }

  private vocFitsFilterOfDataObject(filteredDataObject: FilteredDataObject, voc: Vocabulary) {
    if (filteredDataObject.clas == null && filteredDataObject.unit == null) {
      return true;
    } else if (filteredDataObject.clas != null && filteredDataObject.unit == null) {
      return (filteredDataObject.clas === voc.clas);
    } else {
      return (filteredDataObject.clas === voc.clas && filteredDataObject.unit === voc.unit);
    }
  }
}
