import {Action} from '../interfaces/action';
import {Injectable} from '@angular/core';
import {ClassOption, IVocabulary, UnitOption, Vocabulary} from '../interfaces/vocabulary';
import {ActionMethod} from '../interfaces/action';
import {DbFunctionService} from './db/db-function.service';
import {LocalStorageNamespace} from './local-storage.namespace';
import {VocabularyService} from './vocabulary.service';


@Injectable({
    providedIn: 'root'
})
export class VocabularyDbService {

    constructor(private dbFunctions: DbFunctionService) {
    }

    /*
    // By Bulk Insert First perform all Inserts locally and then push the actions with one request to the server
    async addBulkVocabulary(vocs: Vocabulary[]) {
        const dbResults: IVocabulary[] = [];
        for (let i = 0; i < vocs.length; i++) {
            const voc = vocs[i];
            voc.id = LocalStorageNamespace.getNextPrimaryId();
            const result = await this.dbFunctions.addVoc(voc).catch(err => {
                console.error('Error at the dbFunctions.insertVocabularyJustDb during bulk insert', err);
                throw new Error(err);
            });
            dbResults.push(result[0] as IVocabulary);
        }
        return dbResults;
    }

     */

    async addVocabulary(voc: IVocabulary) {
        return await this.dbFunctions.addVoc(voc).catch(err => {
            console.error(err);
            throw new Error(err);
        });
    }

    async editVocabulary(voc: Vocabulary) {
        return await this.dbFunctions.updateVoc(voc).catch(err => {
            console.error(err);
            throw new Error(err);
        });
    }

    async deleteVocabulary(voc: Vocabulary) {
        return await this.dbFunctions.deleteVoc(voc);
    }

    async getClasses() {
        return await this.dbFunctions.getClasses();
    }

    async getUnits(class_: string) {
        return await this.dbFunctions.getUnits(class_);
    }

    async getVocById(id: string) {
        return await this.dbFunctions.getVocById(id);
    }

    async getAllVocs() {
        return await this.dbFunctions.getAllVocs();
    }

    async getVocsFromOneUnit(class_: string, unit: string) {
        return await this.dbFunctions.getVocsFromOneUnit(class_, unit);
    }

    async getVocsFromOneClass(class_: string) {
        return await this.dbFunctions.getVocsFromOneClass(class_);
    }

    async getAllVocsCount() {
        return await this.dbFunctions.getAllVocsCount();
    }

    async updateVocs(vocUpdatesSinceDate: Vocabulary[]) {
        if (!Array.isArray(vocUpdatesSinceDate) || vocUpdatesSinceDate.length === 0) {
            return;
        }

        for (const voc of vocUpdatesSinceDate) {
            const foundVocsInDb = await this.getVocById(voc.id);

            if (foundVocsInDb.length === 0) {
                await this.addVocabulary(voc);
            } else {
                const dbVoc = foundVocsInDb[0];
                if (voc.last_changed < dbVoc.last_changed) {
                    // db update is newer --> will be pushed separately
                } else {
                    await this.editVocabulary(voc);
                }
            }
        }
    }

    async getNotSyncedVocs() {
        return await this.dbFunctions.getNotSyncedVocs();
    }
}
