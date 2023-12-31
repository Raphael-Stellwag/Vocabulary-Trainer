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
  private class: string;
  private unit: string;
  private unitSetted = true;
  public vocsToQuery: IVocabulary[] = [{primary_language: '', success_count: 0, class: '', unit: '', secondary_language: '', failures_count: 0,
    deleted: false, last_changed: new Date()}];
  private correct = 0;
  private failures = 0;
  public index = 0;

  constructor(public vocService: VocabularyService, public router: Router, public route: ActivatedRoute, public dialog: MatDialog) {
    this.route.params.forEach((params: Params) => {
      if (params['unit'] !== undefined) {
        this.unit = params['unit'];
      }
      if (params['class'] !== undefined) {
        this.class = params['class'];
      }
    });
    if (this.class === undefined || this.class === null) {
      router.navigate(['../']);
    }

    if (this.unit === undefined || this.unit === null || this.unit === '') {
      this.unitSetted = false;
      vocService.getVocsFromOneClas(this.class).then((result: IVocabulary[]) => {this.vocsToQuery = result; });
    } else {
      vocService.getVocsFromOneUnit(this.class, this.unit).then((result: IVocabulary[]) => {this.vocsToQuery = result; });
    }
  }

  ngOnInit() {
  }

  checkPressed() {
    const userInputField = document.getElementById('SecondaryLanguage');
    const secondaryLanguageInput = userInputField.textContent;
    userInputField.innerHTML = '';
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
      if (this.index + 1 < this.vocsToQuery.length) {
        this.index++;
      } else {
        // show FinalDialog
        this.shwoFinalDialog();
      }
    });

  }

  private shwoFinalDialog() {
    const dialogRef = this.dialog.open(DialogQueryFinalResultComponent, {
      width: '250px',
      data: {count: this.index + 1, correct: this.correct, failures: this.failures}
    });

    dialogRef.afterClosed().subscribe(result => {
      const link = ['../'];
      this.router.navigate(link);
    });
  }

}
