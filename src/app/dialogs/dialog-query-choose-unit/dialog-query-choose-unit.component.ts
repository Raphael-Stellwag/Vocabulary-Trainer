import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChosenUnit } from '../../interfaces/chosen-unit';
import { VocabularyDbService } from 'src/app/services/vocabulary-db.service';
import { ClassOption, IVocabulary, UnitOption, Vocabulary } from 'src/app/interfaces/vocabulary';
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
    private vocService: VocabularyDbService, @Inject(MAT_DIALOG_DATA) public input) {
      vocService.getClasses().then((classes: ClassOption[]) => {
        this.classOptions = classes;
      }).catch(err => console.log('ERR', err));
  }

  clasChanged(): void {
    this.vocService.getUnits(this.chosenUnit.class).then((units: UnitOption[]) => {
      this.classChosen = true;
      this.unitOptions = units;
    }).catch(err => console.log('ERR', err));
  }

  cancelClicked(): void {
    this.dialogRef.close();
  }

  okClicked(): void {
    this.dialogRef.close(this.chosenUnit);
  }

}
