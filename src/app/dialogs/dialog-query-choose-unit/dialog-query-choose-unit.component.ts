import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChoosenUnit } from '../../interfaces/choosen-unit';
import { VocabularyDbService } from 'src/app/services/vocabulary-db.service';
@Component({
  selector: 'app-dialog-query-choose-unit',
  templateUrl: './dialog-query-choose-unit.component.html',
  styleUrls: ['./dialog-query-choose-unit.component.css']
})
export class DialogQueryChooseUnitComponent {
  clasOptions = [{}];
  unitOptions = [{}];
  clasChoosen = false;
  choosenUnit: ChoosenUnit = {
    unit: "",
    clas: ""
  }

  constructor(public dialogRef: MatDialogRef<DialogQueryChooseUnitComponent>,
    private vocService: VocabularyDbService, @Inject(MAT_DIALOG_DATA) public input) {
      vocService.getClases().then((classes) => {
        this.clasOptions = classes;
      }).catch(err => console.log("ERR", err));
  }
  
  clasChanged(): void {
    this.vocService.getUnits(this.choosenUnit.clas).then((units) => {
      this.clasChoosen = true;
      this.unitOptions = units;
    }).catch(err => console.log("ERR", err));
  }

  cancelClicked(): void {
    this.dialogRef.close();
  }

  okClicked(): void {
    this.dialogRef.close(this.choosenUnit);
  }

}
