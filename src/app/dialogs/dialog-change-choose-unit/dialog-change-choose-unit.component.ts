import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChoosenUnit } from '../../interfaces/choosen-unit';
import { VocabularyDbService } from 'src/app/services/vocabulary-db.service';

@Component({
  selector: 'app-dialog-change-choose-unit',
  templateUrl: './dialog-change-choose-unit.component.html',
  styleUrls: ['./dialog-change-choose-unit.component.css']
})
export class DialogChangeChooseUnitComponent {
  clasOptions = [{}];
  unitOptions = [{}];
  unitChoosen = false;
  clasChoosen = false;
  data: ChoosenUnit = {
    clas: "",
    unit: "",
  }
  test="";

  constructor(public dialogRef: MatDialogRef<DialogChangeChooseUnitComponent>, private vocService: VocabularyDbService) {
    vocService.getClases().then((classes) => {
      this.clasOptions = classes;
    }).catch(err => console.log("ERR", err));
  }

  cancelClicked(): void {
    this.dialogRef.close();
  }

  okClicked(): void {
    this.dialogRef.close(this.data);
  }

  clasChanged(): void {
    this.vocService.getUnits(this.data.clas).then((units) => {
      this.unitOptions = units;
    }).catch(err => console.log("ERR", err));
    if (this.data.clas != "") {
      this.clasChoosen = true;
    } else {
      this.clasChoosen = false;
    }
  }

  unitChanged(): void {
    if (this.data.unit != "") {
      this.unitChoosen = true;
    } else {
      this.unitChoosen = false;
    }
  }
}
