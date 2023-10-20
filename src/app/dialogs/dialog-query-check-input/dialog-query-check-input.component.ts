import { Component, OnInit, Inject } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog-query-check-input',
  templateUrl: './dialog-query-check-input.component.html',
  styleUrls: ['./dialog-query-check-input.component.css']
})
export class DialogQueryCheckInputComponent {
  correct: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogQueryCheckInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
       if(this.checkUserInput(data)) {
         this.correct = true;
       } else {
         this.correct = false;
       }
    }

  okClicked(): void {
    this.dialogRef.close(this.correct);
  }

  correctClicked() : void {
    this.dialogRef.close(true);
  }

  private checkUserInput(data) {
    return data.userInput.toLocaleLowerCase() == data.voc.secondaryLanguage.toLocaleLowerCase();    
  }
}

