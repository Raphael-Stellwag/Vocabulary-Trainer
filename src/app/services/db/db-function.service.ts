import {Injectable} from '@angular/core';
import {ClassOption, IVocabulary, UnitOption} from '../../interfaces/vocabulary';
import {InitDbService} from './init-db.service';

@Injectable({
    providedIn: 'root'
})
export class DbFunctionService extends InitDbService {
    static db;

    async updateVoc(voc: IVocabulary) {
        const dbVoc = this.toDbVoc(voc);
        return await this.connection.update({
            in: this.tableName,
            set: dbVoc,
            where: {id: dbVoc.id}
        });
    }

    async deleteVoc(voc: IVocabulary) {
        return await this.connection.remove({
            from: this.tableName,
            where: {id: voc.id}
        });
    }

    async addVoc(voc: IVocabulary) {
        const dbVoc = this.toDbVoc(voc);
        const vocs = await this.connection.insert<IVocabulary>({
            into: this.tableName,
            return: true,
            values: [dbVoc]
        }) as IVocabulary[];

        return this.toNormalVocs(vocs);
    }

    async getClasses(): Promise<ClassOption[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {deleted: 'false'},
            groupBy: this.colClas,
            order: {by: this.colClas, type: 'asc', idbSorting: false}
        });
    }

    async getUnits(class_: string): Promise<UnitOption[]> {
        return await this.connection.select({
            from: this.tableName,
            where: {class: class_, deleted: 'false'},
            groupBy: this.colUnit,
            order: {by: this.colUnit, type: 'asc', idbSorting: false}
        });
    }

    async getVocById(id: string): Promise<IVocabulary[]> {
        const vocs = await this.connection.select({
            from: this.tableName,
            where: {id: id}
        }) as IVocabulary[];

        return this.toNormalVocs(vocs);
    }

    async getAllVocs(): Promise<IVocabulary[]> {
        const vocs = await this.connection.select({
            from: this.tableName,
            where: {deleted: 'false'}
        }) as IVocabulary[];

        return this.toNormalVocs(vocs);
    }

    async getVocsFromOneUnit(class_: string, unit: string): Promise<IVocabulary[]> {
        const vocs = await this.connection.select({
            from: this.tableName,
            where: {class: class_, unit: unit, deleted: 'false'},
            order: {by: this.colId, type: 'ASC', idbSorting: false}
        }) as IVocabulary[];

        return this.toNormalVocs(vocs);
    }

    async getVocsFromOneClass(class_: string): Promise<IVocabulary[]> {
        const vocs =  await this.connection.select({
            from: this.tableName,
            where: {class: class_, deleted: 'false'},
            order: {by: this.colId, type: 'ASC', idbSorting: false}
        }) as IVocabulary[];

        return this.toNormalVocs(vocs);
    }

    async getAllVocsCount(): Promise<number> {
        return await this.connection.count({
            from: this.tableName,
            where: {deleted: 'false'}
        });
    }

    async getNotSyncedVocs(): Promise<IVocabulary[]> {
        const vocs = await this.connection.select({
            from: this.tableName,
            where: {synced: 'false'}
        }) as IVocabulary[];

        return this.toNormalVocs(vocs);
    }

    private toDbVoc(voc: IVocabulary) {
        const dbVoc = structuredClone(voc);
        dbVoc.synced = String(dbVoc.synced);
        dbVoc.deleted = String(dbVoc.deleted);
        return dbVoc;
    }

    private toNormalVocs(vocs: IVocabulary[]) {
        for (let voc of vocs) {
            voc = this.toNormalVoc(voc);
        }
        return vocs;
    }

    private toNormalVoc(voc: IVocabulary) {
        voc.synced = Boolean(voc.synced);
        voc.deleted = Boolean(voc.deleted);
        return voc;
    }
}
