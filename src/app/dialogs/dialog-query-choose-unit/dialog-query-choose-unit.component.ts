import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChosenUnit } from '../../interfaces/chosen-unit';
import { VocabularyDbService } from 'src/app/services/vocabulary-db.service';
import { ClassOption, UnitOption } from 'src/app/interfaces/vocabulary';
import { LoggingService } from 'src/app/services/logging.service';
@Component({
    selector: 'app-dialog-query-choose-unit',
    templateUrl: './dialog-query-choose-unit.component.html',
    styleUrls: ['./dialog-query-choose-unit.component.css']
})

export class DialogQueryChooseUnitComponent {
    classOptions: ClassOption[] = [];
    unitOptions: UnitOption[] = [];
    classChosen = false;
    chosenUnit: ChosenUnit = {
        unit: '',
        class: ''
    };

    constructor(public dialogRef: MatDialogRef<DialogQueryChooseUnitComponent>,
        private vocService: VocabularyDbService, @Inject(MAT_DIALOG_DATA) public input, private log: LoggingService) {
        vocService.getClasses().then((classes: ClassOption[]) => {
            this.classOptions = classes;
        }).catch(err => this.log.error('ERR', err));
    }

    clasChanged(): void {
        this.vocService.getUnits(this.chosenUnit.class).then((units: UnitOption[]) => {
            this.classChosen = true;
            this.unitOptions = units;
        }).catch(err => this.log.error('ERR', err));
    }

    cancelClicked(): void {
        this.dialogRef.close();
    }

    okClicked(): void {
        this.dialogRef.close(this.chosenUnit);
    }

}
