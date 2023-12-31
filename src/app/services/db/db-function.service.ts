import {Injectable} from '@angular/core';
import {ClassOption, IVocabulary, UnitOption} from '../../interfaces/vocabulary';
import {InitDbService} from './init-db.service';

@Injectable({
    providedIn: 'root'
})
export class DbFunctionService extends InitDbService {
    static db;

    async updateVoc(voc: IVocabulary) {
        return await this.connection.update({
            in: this.tableName,
            set: voc,
            where: {id: voc.id}
        });
    }

    async deleteVoc(voc: IVocabulary) {
        return await this.connection.remove({
            from: this.tableName,
            where: {id: voc.id}
        });
    }

    async addVoc(voc: IVocabulary) {
        return await this.connection.insert<IVocabulary>({
            into: this.tableName,
            return: true,
            values: [voc]
        });
    }

    async getClasses(): Promise<ClassOption[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {deleted: false},
            groupBy: this.colClas,
            order: {by: this.colClas, type: 'asc', idbSorting: false}
        });
    }

    async getUnits(class_: string): Promise<UnitOption[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {class: class_, deleted: false},
            groupBy: this.colUnit,
            order: {by: this.colUnit, type: 'asc', idbSorting: false}
        });
    }

    async getVocById(id: number): Promise<IVocabulary[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {id: id, deleted: false}
        });
    }

    async getAllVocs(): Promise<IVocabulary[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {deleted: false}
        });
    }

    async getHighestId(): Promise<any> {
        return await this.connection.select({
            from: this.tableName,
            where: {deleted: false},
            limit: 1,
            order: {by: this.colId, type: 'desc'}
        });
    }

    async getVocsFromOneUnit(class_: string, unit: string): Promise<IVocabulary[]> {
        return this.connection.select({
            from: this.tableName,
            where: {class: class_, unit: unit, deleted: false},
            order: {by: this.colId, type: 'ASC', idbSorting: false}
        });
    }

    async getVocsFromOneClass(class_: string): Promise<IVocabulary[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {class: class_, deleted: false},
            order: {by: this.colId, type: 'ASC', idbSorting: false}
        });
    }

    async getAllVocsCount(): Promise<number> {
        return await this.connection.count({
            from: this.tableName,
            where: {deleted: false}
        });
    }

}
