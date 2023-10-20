import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-error-message',
  templateUrl: './dialog-error-message.component.html',
  styleUrls: ['./dialog-error-message.component.css']
})
export class DialogErrorMessageComponent {

  constructor(public dialogRef: MatDialogRef<DialogErrorMessageComponent>) {}

  public errorMessage:string;

}
