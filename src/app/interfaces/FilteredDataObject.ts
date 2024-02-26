import { Vocabulary } from './vocabulary';

export class FilteredDataObject {
    class: string;
    unit: string;
    data: Vocabulary[];

    constructor() {
        this.data = [];
    }
}

