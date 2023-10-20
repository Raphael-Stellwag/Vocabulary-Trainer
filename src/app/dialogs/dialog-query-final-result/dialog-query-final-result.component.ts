import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-query-final-result',
  templateUrl: './dialog-query-final-result.component.html',
  styleUrls: ['./dialog-query-final-result.component.css']
})
export class DialogQueryFinalResultComponent {
  resultMessage;

  constructor(
    public dialogRef: MatDialogRef<DialogQueryFinalResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.resultMessage = this.calculateResultMessage();
    }

  okClicked(): void {
    this.dialogRef.close();
  }

  private calculateResultMessage() {
    //TODO
    return "Implement later"
  }
}
