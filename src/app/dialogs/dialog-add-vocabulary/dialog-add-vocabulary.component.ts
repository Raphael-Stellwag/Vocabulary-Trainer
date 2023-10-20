import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog-add-vocabulary',
  templateUrl: './dialog-add-vocabulary.component.html',
  styleUrls: ['./dialog-add-vocabulary.component.css']
})
export class DialogAddVocabularyComponent {

  constructor(public dialogRef: MatDialogRef<DialogAddVocabularyComponent>, @Inject(MAT_DIALOG_DATA) public voc) { 
  }

  cancelClicked(): void {
    this.dialogRef.close();
  }

  okClicked(): void {
    this.dialogRef.close(this.voc);
  }
}
