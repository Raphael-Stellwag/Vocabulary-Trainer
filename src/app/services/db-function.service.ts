import { Injectable } from '@angular/core';
import { ClassOption, IVocabulary, UnitOption } from '../interfaces/vocabulary';
import { InitDbService } from './init-db.service';

@Injectable({
    providedIn: 'root'
})
export class DbFunctionService extends InitDbService {
    static db;

    constructor() {
        super();
    }

    public updateVocabularyJustDb(voc: IVocabulary) {
        return this.connection.update({ in: this.tableName, set: voc, where: { id: voc.id } });
    }

    public deleteVocabularyJustDb(voc: IVocabulary) {
        return this.connection.remove({ from: this.tableName, where: { id: voc.id } });
    }

    public insertVocabularyJustDb(voc: IVocabulary) {
        return this.connection.insert<IVocabulary>({
            into: this.tableName,
            return: true,
            values: [voc]
        });
    }

    getClases() {
        return this.connection.select({ from: this.tableName, groupBy: this.colClas, order: { by: this.colClas, type: "asc", idbSorting: false } }) as Promise<ClassOption[]>;
    }

    getUnits(clas: string): Promise<UnitOption[]> {
        return this.connection.select({ from: this.tableName, where: { clas: clas }, groupBy: this.colUnit, order: { by: this.colUnit, type: "asc", idbSorting: false } }) as Promise<UnitOption[]>;
    }

    getVocabularybyId(id: number): Promise<any> {
        return this.connection.select({ from: this.tableName, where: { id: id } });
    }

    getAllVocs(): Promise<any> {
        return this.connection.select({ from: this.tableName });
    }

    getHighestId(): Promise<any> {
        return this.connection.select({ from: this.tableName, limit: 1, order: { by: this.colId, type: "desc" } });
    }

    getVocsFromOneUnit(clas: string, unit: string): Promise<any> {
        return this.connection.select({ from: this.tableName, where: { clas: clas, unit: unit }, order: { by: this.colId, type: "ASC", idbSorting: false } })
    }

    getVocsFromOneClas(clas: string): Promise<any> {
        return this.connection.select({ from: this.tableName, where: { clas: clas }, order: { by: this.colId, type: "ASC", idbSorting: false } })
    }

    async getAllVocsCount(): Promise<number> {
        return await this.connection.count({ from: this.tableName });
    }

}