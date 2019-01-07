import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { VarPrimaryLanguageComponent } from '../../frames/var-primary-language/var-primary-language.component';
import { LocalStorageNamespace } from '../../services/local-storage.namespace';
import { VocabularyDbService } from 'src/app/services/vocabulary-db.service';
import { Vocabulary } from 'src/app/interfaces/vocabulary';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { DialogQueryChooseUnitComponent } from 'src/app/dialogs/dialog-query-choose-unit/dialog-query-choose-unit.component'
import { LoadingSpinnerComponent } from 'src/app/frames/loading-spinner/loading-spinner.component';
import { Overlay} from '@angular/cdk/overlay';
import { ComponentPortal} from '@angular/cdk/portal';
import { VocabularyRestService } from 'src/app/services/vocabulary-rest.service';


@Component({
  selector: 'app-site-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SiteSettingsComponent implements OnInit {
  @ViewChild("VarPrimaryLanguage") varPrimaryLanguageComponent;
  @ViewChild("VarSecondaryLanguage") varSecondaryLanguageComponent;

  constructor(public snackBar: MatSnackBar, public auth: AuthService, private dialog: MatDialog, private vocService: VocabularyDbService, private overlay: Overlay, private rest: VocabularyRestService ) { }

  ngOnInit() {
    console.log(this.auth.accessToken);
    console.log(this.auth.idToken);
  }

  saveButtonPressed() {
    let newPrimaryLanguage: string = this.varPrimaryLanguageComponent.getPrimaryLanguage();
    let newSecondaryLanguage: string = this.varSecondaryLanguageComponent.getSecondaryLanguage();
    LocalStorageNamespace.newPrimaryLanguage(newPrimaryLanguage);
    LocalStorageNamespace.newSecondaryLanguage(newSecondaryLanguage);
    this.snackBar.open("Languages successfully saved" , null, {duration:2000});
  }

  chooseFileToImport() {
    var _this = this;
    document.getElementById("importFile").onchange = function(ev) {
      _this.importFile(ev);
    }
    document.getElementById("importFile").click();
  }

  importFile(event)  {
    const overlayRef = this.overlay.create({height: '100%', width: '100%'});
    const userProfilePortal = new ComponentPortal(LoadingSpinnerComponent);
    overlayRef.attach(userProfilePortal);

    const dataType = (<any>document.getElementById("importFile")).files.item(0).type;
    let _this = this;
    if (dataType === "application/json") {
      let fr = new FileReader();
      fr.onload = function(e) {
        let readVocs:any[] = JSON.parse(<string>fr.result);
        let addVocs: Vocabulary[] = Array();
        if (readVocs[0].Klasse != null) {
          for(let voc of readVocs) {
            if (voc.Klasse != null) {
              addVocs.push(new Vocabulary(voc.id, voc.Versuche, voc.Fehlversuche, voc.Klasse, voc.Unit, voc.Wort_Deutsch, voc.Wort_Englisch));
            }
          }
        } else {
          addVocs = readVocs;
        }
        _this.vocService.addBulkVocabulary(addVocs).then(result => {
          overlayRef.dispose();
          let message = addVocs.length + " Vocabularies successfully saved";
          _this.snackBar.open(message , null, {duration:2000});
        })

      }
      fr.readAsText(event.target.files[0]);
    }
  }

  chooseVocabularyToExport() {
    const dialogRef = this.dialog.open(DialogQueryChooseUnitComponent, {
      width: '250px',
      data: {reason: "export"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (result.unit === undefined || result.unit === null) {
          this.vocService.getVocsFromOneClas(result.clas).then((vocResult:Vocabulary[]) => {this.startDownload(vocResult) });
        } else {
          this.vocService.getVocsFromOneUnit(result.clas, result.unit).then((vocResult:Vocabulary[]) => {this.startDownload(vocResult)})
        }
      }
    });
  }

  startDownload(vocs: Vocabulary[]) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocs));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", vocs[0].clas + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  loginButtonPressed() {
    //
    this.auth.login();
  }
}
