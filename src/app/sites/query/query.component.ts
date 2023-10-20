import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IVocabulary } from '../../interfaces/vocabulary';
import {MatDialog} from '@angular/material/dialog';
import { DialogQueryCheckInputComponent } from 'src/app/dialogs/dialog-query-check-input/dialog-query-check-input.component';
import { DialogQueryFinalResultComponent } from 'src/app/dialogs/dialog-query-final-result/dialog-query-final-result.component';
import { VocabularyService } from 'src/app/services/vocabulary.service';

@Component({
  selector: 'app-site-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class SiteQueryComponent implements OnInit {
  private clas: string;
  private unit: string;
  private unitSetted: boolean = true;
  public vocsToQuery: IVocabulary[] = [{primaryLanguage: "", tries:0, clas:"", unit:"", secondaryLanguage: "", failuresCount:0}];
  private correct: number = 0;
  private failures: number = 0;
  public index:number = 0;

  constructor(public vocService: VocabularyService, public router: Router, public route: ActivatedRoute, public dialog: MatDialog) { 
    this.route.params.forEach((params: Params) => {
      if (params['unit'] !== undefined) {
        this.unit = params['unit'];
      }
      if (params['clas'] !== undefined) {
        this.clas = params['clas'];
      }
    });
    if (this.clas === undefined || this.clas === null) {
      router.navigate(["../"]);
    }

    if (this.unit === undefined || this.unit === null || this.unit === "") {
      this.unitSetted = false;
      vocService.getVocsFromOneClas(this.clas).then((result:IVocabulary[]) => {this.vocsToQuery = result; });
    } else {
      vocService.getVocsFromOneUnit(this.clas, this.unit).then((result:IVocabulary[]) => {this.vocsToQuery = result})
    }
  }

  ngOnInit() {
  }

  checkPressed() {
    let userInputField = document.getElementById("SecondaryLanguage");
    let secondaryLanguageInput = userInputField.textContent;
    userInputField.innerHTML = "";
    userInputField.focus();

    const dialogRef = this.dialog.open(DialogQueryCheckInputComponent, {
      width: '250px',
      data: {voc: this.vocsToQuery[this.index], userInput: secondaryLanguageInput}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.correct++;
      } else {
        this.failures++;
      }
      if(this.index + 1 < this.vocsToQuery.length) {
        this.index++;
      } else {
        //show FinalDialog
        this.shwoFinalDialog();
      }
    });
    
  }

  private shwoFinalDialog() {
    const dialogRef = this.dialog.open(DialogQueryFinalResultComponent, {
      width: '250px',
      data: {count: this.index+1, correct: this.correct, failures: this.failures}
    });

    dialogRef.afterClosed().subscribe(result => {
      const link = ['../'];
      this.router.navigate(link);
    });
  }

}
