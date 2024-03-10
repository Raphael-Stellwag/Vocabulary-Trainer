import { Component, OnInit, Inject } from '@angular/core';
import { Vocabulary } from 'src/app/interfaces/vocabulary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-dialog-edit-vocabulary',
  templateUrl: './dialog-edit-vocabulary.component.html',
  styleUrls: ['./dialog-edit-vocabulary.component.css']
})
export class DialogEditVocabularyComponent {
  private data: Vocabulary;
  private saved = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditVocabularyComponent>,
    @Inject(MAT_DIALOG_DATA) public voc: Vocabulary,
    private vocService: VocabularyService, private snackBar: MatSnackBar, private log: LoggingService) {
    this.data = Vocabulary.createCorrectReference(voc);
    const _this = this;
    dialogRef.beforeClosed().subscribe(res => {
      if (res != true) {
        _this.voc.primary_language = _this.data.primary_language;
        _this.voc.secondary_language = _this.data.secondary_language;
        _this.voc.id = _this.data.id;
        _this.voc.unit = _this.data.unit;
      }
    });
  }

  cancelClicked(): void {
    this.dialogRef.close();
  }

  editClicked(): void {
    this.saved = true;
    this.vocService.editVocabulary(this.voc).then(() => {
      this.dialogRef.close(true);
      this.snackBar.open('Vocabulary successfully edited', null, { duration: 2000 });
    }).catch(err => {
      this.dialogRef.close(false);
      this.log.warn(err);
      this.snackBar.open('Failed to edit Vocabulary', null, { duration: 2000 });
    });
  }
}
