import { VocabularyService } from './../../services/vocabulary.service';
import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar} from '@angular/material/snack-bar'
import {MatDialog } from '@angular/material/dialog';

import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { DialogEditVocabularyComponent } from '../dialog-edit-vocabulary/dialog-edit-vocabulary.component';

@Component({
  selector: 'app-dialog-change-remove-bottom-sheet',
  templateUrl: './dialog-change-remove-bottom-sheet.component.html',
  styleUrls: ['./dialog-change-remove-bottom-sheet.component.css']
})
export class DialogChangeRemoveBottomSheetComponent {
  constructor(public snackBar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef<DialogChangeRemoveBottomSheetComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public voc: any, public dialog: MatDialog, public vocService: VocabularyService) {
  }

  deleteVoc(event: MouseEvent): void {
    let dialogRef = this.dialog.open(DialogConfirmationComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    dialogRef.afterClosed().toPromise().then(result => {
      if(result) {
        this.vocService.deleteVocabulary(this.voc).then(() => {
          this.snackBar.open("Vocabulary successfully deleted" , null, {duration:2000});
          this.bottomSheetRef.dismiss(true);
        }).catch(err => this.snackBar.open(JSON.parse(err) , null, {duration:2000}));
      }
      dialogRef = null;
    }).catch(() => {
      this.bottomSheetRef.dismiss(false);
    });
    
  }

  editVoc(event: MouseEvent): void {
    let dialogRef = this.dialog.open(DialogEditVocabularyComponent, {
      width: '250px',
      data: this.voc
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.bottomSheetRef.dismiss();    
      }
    });

    
  }
}
