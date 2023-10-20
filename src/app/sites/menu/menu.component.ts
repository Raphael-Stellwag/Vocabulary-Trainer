import { MatSnackBar } from '@angular/material/snack-bar';
import { VocabularyService } from 'src/app/services/vocabulary.service';
import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DialogChangeChooseUnitComponent } from '../../dialogs/dialog-change-choose-unit/dialog-change-choose-unit.component';
import { Router } from '@angular/router';
import { DialogQueryChooseUnitComponent } from 'src/app/dialogs/dialog-query-choose-unit/dialog-query-choose-unit.component';

@Component({
  selector: 'app-site-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class SiteMenuComponent {

  constructor(public dialog: MatDialog, public router: Router, private vocService: VocabularyService, private snackBar: MatSnackBar) { }

  changeButtonPressed() {
    const dialogRef = this.dialog.open(DialogChangeChooseUnitComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const link = ['../change', result.clas, result.unit];
        this.router.navigate(link);
      }
    });
  }

  async queryButtonPressed() {
    let count = await this.vocService.getVocabularyCount();

    if (count == 0) {
      this.snackBar.open("You first have to add Vocabularies (under Change)" , null, {duration:5000});
    } else {
      const dialogRef = this.dialog.open(DialogQueryChooseUnitComponent, {
        width: '250px',
        data: { reason: "train" }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          let link;
          if (result.unit == null) {
            link = ['../query', result.clas];
          } else {
            link = ['../query', result.clas, result.unit];
          }
          this.router.navigate(link);
        }
      });
    }

  }

}
