import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChosenUnit } from '../../interfaces/chosen-unit';
import { VocabularyDbService } from 'src/app/services/vocabulary-db.service';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
    selector: 'app-dialog-change-choose-unit',
    templateUrl: './dialog-change-choose-unit.component.html',
    styleUrls: ['./dialog-change-choose-unit.component.css']
})
export class DialogChangeChooseUnitComponent {
    classOptions = [];
    unitOptions = [];
    unitChosen = false;
    classChosen = false;
    data: ChosenUnit = {
        class: '',
        unit: '',
    };
    test = '';

    constructor(public dialogRef: MatDialogRef<DialogChangeChooseUnitComponent>, private vocService: VocabularyDbService, private log: LoggingService) {
        vocService.getClasses().then((classes) => {
            this.classOptions = classes;
        }).catch(err => this.log.error('ERR', err));
    }

    cancelClicked(): void {
        this.dialogRef.close();
    }

    okClicked(): void {
        this.dialogRef.close(this.data);
    }

    classChanged(): void {
        this.vocService.getUnits(this.data.class).then((units) => {
            this.unitOptions = units;
        }).catch(err => this.log.error('ERR', err));
        if (this.data.class !== '') {
            this.classChosen = true;
        } else {
            this.classChosen = false;
        }
    }

    unitChanged(): void {
        if (this.data.unit !== '') {
            this.unitChosen = true;
        } else {
            this.unitChosen = false;
        }
    }
}
