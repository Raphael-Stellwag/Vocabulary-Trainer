import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmationComponent>) {}

  public confirmMessage:string;
  public confirmTitle:string = "Confirm";
  public confirmButton = "Confirm";
  public cancelButton = "Cancel";
}
