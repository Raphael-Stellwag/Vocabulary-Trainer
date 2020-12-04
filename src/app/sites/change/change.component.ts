import { FilteredDataObject } from './../../interfaces/FilteredDataObject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IVocabulary, Vocabulary } from '../../interfaces/vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { DialogAddVocabularyComponent } from "../../dialogs/dialog-add-vocabulary/dialog-add-vocabulary.component";
import { DialogChangeRemoveBottomSheetComponent } from "../../dialogs/dialog-change-remove-bottom-sheet/dialog-change-remove-bottom-sheet.component";
import { VocabularyService } from 'src/app/services/vocabulary.service';

@Component({
  selector: 'app-site-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class SiteChangeComponent implements OnInit, OnDestroy {
  unit: string;
  clas: string;
  vocs: FilteredDataObject = new FilteredDataObject();

  constructor(public vocService: VocabularyService, public router: Router, public route: ActivatedRoute, public dialog: MatDialog, public snackBar: MatSnackBar, private bottomSheet: MatBottomSheet) { 
    this.route.params.forEach((params: Params) => {
      if (params['unit'] !== undefined) {
        this.unit = params['unit'];
      }
      if (params['clas'] !== undefined) {
        this.clas = params['clas'];
      }
    });
    if (this.clas === undefined || this.clas === null || this.unit === undefined || this.unit === null) {
      router.navigate(["../"]);
    }
  }
  
  async ngOnInit() {
    this.vocs = await this.vocService.getVocsFromOneUnitWithUpdate(this.clas, this.unit);
  }
  
  ngOnDestroy(): void {
    this.vocService.removeFilteredDataObject(this.vocs);
  }

  vocPressed(voc) {
    this.bottomSheet.open(DialogChangeRemoveBottomSheetComponent, {
      data: voc
    });
  }

  addClicked() {
    let voc = {} as IVocabulary;
    voc.unit = this.unit;
    voc.clas = this.clas;
    voc.failuresCount = 0;
    voc.tries = 0;
    
    const dialogRef = this.dialog.open(DialogAddVocabularyComponent, {
      width: '250px',
      data: voc
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.vocService.addVocabulary(result).then((newVocs) => this.vocs.push(Vocabulary.createCorrectReference(newVocs[0])));
        this.snackBar.open("Vocabulary successfully added", null, {duration: 2000})
      }
    });
  }
  
}