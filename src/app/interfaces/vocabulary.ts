export interface IVocabulary {
    id?;
    tries;
    failuresCount;
    
    clas;
    unit;
    primaryLanguage;
    secondaryLanguage;
}

export interface UnitOption {
    unit: string
}
  
export interface ClasOption {
    clas: string
}

export class Vocabulary implements IVocabulary{
    id;
    tries;
    failuresCount;
    
    clas;
    unit;
    primaryLanguage;
    secondaryLanguage; 

    constructor(newId?, newTries?, newFailuresCount?, newClas?, newUnit?, newPrimaryLanguage?, newSecondaryLanguage?) {
        this.id = newId;
        this.tries = newTries;
        this.failuresCount = newFailuresCount;
        this.clas = newClas;
        this.unit = newUnit;
        this.primaryLanguage = newPrimaryLanguage;
        this.secondaryLanguage = newSecondaryLanguage;
    }

    setNewValues(newVocValues: Vocabulary) {
        this.id = newVocValues.id;
        this.tries = newVocValues.tries;
        this.failuresCount = newVocValues.failuresCount;
        this.clas = newVocValues.clas;
        this.unit = newVocValues.unit;
        this.primaryLanguage = newVocValues.primaryLanguage;
        this.secondaryLanguage = newVocValues.secondaryLanguage;
    }
    
    createNewObject() {
        return new Vocabulary(this.id, this.tries, this.failuresCount, this.clas, this.unit, this.primaryLanguage, this.secondaryLanguage);
    }

    static createCorrectReferences(vocs) {
        let newVocs: Vocabulary[] = new Array();
        for(let element of vocs) {
            let newVoc = new Vocabulary(element.id, element.tries, element.failuresCount, element.clas, element.unit, element.primaryLanguage, element.secondaryLanguage);
            console.log(newVoc);
            newVocs.push(newVoc);
        }
        return newVocs;
    }

    static createCorrectReference(voc) {
        return new Vocabulary(voc.id, voc.tries, voc.failuresCount, voc.clas, voc.unit, voc.primaryLanguage, voc.secondaryLanguage);
    }

}