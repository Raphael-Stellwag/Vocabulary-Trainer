import {VocabularyRestService} from 'src/app/services/vocabulary-rest.service';
import {FilteredDataObject} from '../interfaces/FilteredDataObject';
import {VocabularyDbService} from './vocabulary-db.service';
import {IVocabulary, Vocabulary} from '../interfaces/vocabulary';
import {Injectable} from '@angular/core';
import * as uuid from 'uuid';
import {LocalStorageNamespace} from './local-storage.namespace';

@Injectable({
    providedIn: 'root'
})
export class VocabularyService {
    private currentUsedFilteredDataObject: FilteredDataObject[] = [];

    constructor(private dbService: VocabularyDbService, private restService: VocabularyRestService) {
    }

    async addVocabulary(voc: Vocabulary): Promise<any> {
        voc.last_changed = new Date();
        const vocWithId = await this.restService.postVocabulary(voc);
        if (vocWithId === null) {
            voc.id = 'LOKAL_' + uuid.v4();
            voc.synced = false;
        } else {
            voc = vocWithId;
            voc.synced = true;
        }
        // voc = Vocabulary.createCorrectReference(voc);
        const result = await this.dbService.addVocabulary(voc);

        this.addVocToAllFilteredDataObjects(voc);
        return voc;
    }

    async editVocabulary(voc: Vocabulary) {

        const updatedVoc = await this.restService.putVocabulary(voc);
        if (updatedVoc === null) {
            voc.last_changed = new Date();
        } else {
            voc = updatedVoc;
        }

        voc = Vocabulary.createCorrectReference(voc);

        const result = await this.dbService.editVocabulary(voc);

        this.editVocInAllFilteredDataObjects(voc);
    }

    async deleteVocabulary(voc: Vocabulary) {
        this.deleteVocFromFilteredDataObjects(voc);
        const success = await this.restService.deleteVocabulary(voc);

        if (success) {
            await this.dbService.deleteVocabulary(voc);
        } else {
            voc.deleted = true;
            voc.last_changed = new Date();
            await this.dbService.editVocabulary(voc);
        }

    }

    async sync() {

        const date_before_update = new Date();

        // Get All Remote Ids
        // If there is a local Id (which is synced = true) with no corresponding remote Id --> delete Voc local
        const remoteIds = await this.restService.getAllVocIds();
        await this.dbService.deleteVocsNotInList(remoteIds);

        // Get Remote Vocs (changed since last successful sync) --> Date of last sync needs to be saved in Localstorage
        // Get corresponding local Vocs and update them if (last update from remote newer than local one)
        const lastSyncDate = LocalStorageNamespace.getLastSyncDate();
        const vocUpdatesSinceDate = await this.restService.getVocUpdatesSinceDate(lastSyncDate);
        await this.dbService.updateVocs(vocUpdatesSinceDate);

        // Get Local Vocs (with flag synced = false) --> post (if id starts with LOKAL_) / put / delete (delete Flag) remote vocs
        // Update Db (remove sync flag / delete vocs which are flagged for delete)
        const dbVocs = await this.dbService.getNotSyncedVocs();

        for (const voc of Vocabulary.createCorrectReferences(dbVocs)) {
            if (voc.deleted === true) {
                await this.restService.deleteVocabulary(voc);
                await this.dbService.deleteVocabulary(voc);
            } else {
                if (voc.id.startsWith('LOKAL_')) {
                    const newVoc = await this.restService.postVocabulary(voc);
                    await this.dbService.deleteVocabulary(voc);
                    await this.dbService.addVocabulary(newVoc);
                } else {
                    const newVoc = await this.restService.putVocabulary(voc);
                    await this.dbService.editVocabulary(newVoc);
                }
            }
        }

        await this.updateCurrentUsedFilteredDataObjects();

        LocalStorageNamespace.setLastSyncDate(date_before_update);
    }

    async addBulkVocabulary(vocs: Vocabulary[]) {
        const promises: Promise<Vocabulary>[] = [];

        for (const voc of vocs) {
            promises.push(this.addVocabulary(voc));
        }

        return await Promise.all(promises);
    }

    async getVocabularyCount() {
        return await this.dbService.getAllVocsCount();
    }

    /**
     * Get all Vocabularies for a class, this array wont be updated automatically as in getAllVocs
     * @param class_ Class to get Vocabularies for
     */
    async getVocsFromOneClas(class_: string): Promise<Vocabulary[]> {
        const vocs = await this.dbService.getVocsFromOneClass(class_);
        return Vocabulary.createCorrectReferences(vocs);
    }

    /**
     * Get all Vocabularies for a unit, this array wont be updated automatically as in getAllVocs
     * @param class_ Class to get Vocabularies for
     * @param unit unit to get Vocabularies for
     */
    async getVocsFromOneUnit(class_: string, unit: string): Promise<Vocabulary[]> {
        const vocs = await this.dbService.getVocsFromOneUnit(class_, unit);
        return Vocabulary.createCorrectReferences(vocs);
    }

    async getVocsFromOneUnitWithUpdate(class_: string, unit: string): Promise<FilteredDataObject> {
        const result = await this.dbService.getVocsFromOneUnit(class_, unit);
        const filteredDataObject = new FilteredDataObject();
        console.log(filteredDataObject);
        filteredDataObject.class = class_;
        filteredDataObject.unit = unit;
        filteredDataObject.data = Vocabulary.createCorrectReferences(result);

        this.currentUsedFilteredDataObject.push(filteredDataObject);
        return filteredDataObject;
    }

    async getAllVocsWithUpdates(): Promise<FilteredDataObject> {
        const result = await this.dbService.getAllVocs();
        const filteredDataObject = new FilteredDataObject();
        filteredDataObject.data = Vocabulary.createCorrectReferences(result);
        this.currentUsedFilteredDataObject.push(filteredDataObject);
        return filteredDataObject;
    }

    public removeFilteredDataObject(obj: FilteredDataObject) {
        if (this.currentUsedFilteredDataObject.includes(obj)) {
            this.currentUsedFilteredDataObject.splice(this.currentUsedFilteredDataObject.indexOf(obj), 1);
        }
    }

    private async updateCurrentUsedFilteredDataObjects() {
        for (const object of this.currentUsedFilteredDataObject) {
            let vocs: IVocabulary[] = [];
            if (object.class == null && object.unit == null) {
                vocs = await this.dbService.getAllVocs();
            } else if (object.class != null && object.unit == null) {
                vocs = await this.dbService.getVocsFromOneClass(object.class);
            } else {
                vocs = await this.dbService.getVocsFromOneUnit(object.class, object.unit);
            }
            object.data = Vocabulary.createCorrectReferences(vocs);
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
        if (filteredDataObject.class == null && filteredDataObject.unit == null) {
            return true;
        } else if (filteredDataObject.class != null && filteredDataObject.unit == null) {
            return (filteredDataObject.class === voc.class);
        } else {
            return (filteredDataObject.class === voc.class && filteredDataObject.unit === voc.unit);
        }
    }

    async deleteAllVocabularies() {
        const allVocs = await this.dbService.getAllVocs();
        const promises = [];

        for (const voc of allVocs) {
            if (!(voc.deleted || voc.id.startsWith('LOKAL_'))) {
                try {
                    promises.push(this.restService.deleteVocabulary(voc));
                } catch (e) {
                    console.error(e);
                }
            }
            promises.push(this.dbService.deleteVocabulary(voc));
        }

        LocalStorageNamespace.setLastSyncDate(new Date(0));

        await Promise.all(promises);

        return allVocs.length;
    }
}
