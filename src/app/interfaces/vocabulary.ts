export interface IVocabulary {
    id?: string;
    success_count: number;
    failures_count: number;

    class: string;
    unit: string;
    primary_language: string;
    secondary_language: string;

    last_changed: Date;
    deleted: boolean;
    synced: boolean;
}

export interface UnitOption {
    unit: string;
}

export interface ClassOption {
    class: string;
}

export class Vocabulary implements IVocabulary {
    id: string;
    success_count: number;
    failures_count: number;

    class: string;
    unit: string;
    primary_language: string;
    secondary_language: string;

    last_changed: Date;
    deleted = false;
    synced = true;

    constructor(new_id?, new_success_count?, new_failures_count?, new_class?, new_unit?, new_primary_language?, new_secondary_language?,
                new_last_changed?, new_deleted?, new_synced?) {

        this.id = new_id;
        this.success_count = new_success_count;
        this.failures_count = new_failures_count;
        this.class = new_class;
        this.unit = new_unit;
        this.primary_language = new_primary_language;
        this.secondary_language = new_secondary_language;
        this.last_changed = new_last_changed;
        this.deleted = new_deleted;
        this.synced = new_synced;
    }

    private static createNewObject(context: IVocabulary) {
        const voc = new Vocabulary(context.id, context.success_count, context.failures_count, context.class, context.unit,
            context.primary_language, context.secondary_language, context.last_changed, context.deleted, context.synced);

        if (voc.deleted !== false && voc.deleted !== true) {
            voc.deleted = false;
        }
        if (voc.synced !== false && voc.synced !== true) {
            voc.synced = true;
        }
        return voc;
    }

    static createCorrectReferences(vocs: IVocabulary[]) {
        const newVocs: Vocabulary[] = [];
        for (const element of vocs) {
            const newVoc = this.createNewObject(element);
            console.log(newVoc);
            newVocs.push(newVoc);
        }
        return newVocs;
    }

    static createCorrectReference(voc: IVocabulary) {
        return this.createNewObject(voc);
    }

}
