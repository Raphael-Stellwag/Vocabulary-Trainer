import { Component, OnInit } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

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
