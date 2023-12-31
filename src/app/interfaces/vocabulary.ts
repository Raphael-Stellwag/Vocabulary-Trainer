export interface IVocabulary {
    id?;
    success_count;
    failures_count;

    class;
    unit;
    primary_language;
    secondary_language;

    last_changed;
    deleted;
}

export interface UnitOption {
    unit: string;
}

export interface ClassOption {
    class: string;
}

export class Vocabulary implements IVocabulary {
    id;
    success_count;
    failures_count;

    class;
    unit;
    primary_language;
    secondary_language;

    last_changed;
    deleted;

    constructor(new_id?, new_success_count?, new_failures_count?, new_class?, new_unit?, new_primary_language?, new_secondary_language?,
                new_last_changed?, new_deleted?) {
        this.id = new_id;
        this.success_count = new_success_count;
        this.failures_count = new_failures_count;
        this.class = new_class;
        this.unit = new_unit;
        this.primary_language = new_primary_language;
        this.secondary_language = new_secondary_language;
        this.last_changed = new_last_changed;
        this.deleted = new_deleted;
    }

    private static createNewObject(context: IVocabulary) {
        return new Vocabulary(context.id, context.success_count, context.failures_count, context.class, context.unit,
            context.primary_language, context.secondary_language, context.last_changed, context.deleted);
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
