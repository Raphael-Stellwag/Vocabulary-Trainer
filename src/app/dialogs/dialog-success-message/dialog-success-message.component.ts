import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-success-message',
  templateUrl: './dialog-success-message.component.html',
  styleUrls: ['./dialog-success-message.component.css']
})
export class DialogSuccessMessageComponent {

  constructor(public dialogRef: MatDialogRef<DialogSuccessMessageComponent>) {}

  public successMessage:string;
  public successTitle:string;

}
