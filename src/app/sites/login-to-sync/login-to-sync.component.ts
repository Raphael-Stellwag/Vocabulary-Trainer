import { InternetConnectionService } from './../../services/internet-connection.service';
import { DialogConfirmationComponent } from './../../dialogs/dialog-confirmation/dialog-confirmation.component';
import { Overlay } from '@angular/cdk/overlay';
import { VocabularyRestService } from 'src/app/services/vocabulary-rest.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { ComponentPortal} from '@angular/cdk/portal';
import { LoadingSpinnerComponent } from 'src/app/frames/loading-spinner/loading-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorMessageComponent } from 'src/app/dialogs/dialog-error-message/dialog-error-message.component';
import { DialogSuccessMessageComponent } from 'src/app/dialogs/dialog-success-message/dialog-success-message.component';
import { VocabularyService } from 'src/app/services/vocabulary.service';


@Component({
  selector: 'app-login-to-sync',
  templateUrl: './login-to-sync.component.html',
  styleUrls: ['./login-to-sync.component.css']
})
export class LoginToSyncComponent implements OnInit {
  @ViewChildren('user') userDiv;
  @ViewChildren('password') passwordDiv;
  private overlayRef;

  constructor(private auth: AuthService, private router: Router, private vocRest: VocabularyService, 
    private overlay: Overlay, public dialog: MatDialog, private internetConnection: InternetConnectionService) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(["../"]);
    }
  }

  login() {
    let user: string = this.userDiv.first.nativeElement.innerText;
    let password: string = this.passwordDiv.first.nativeElement.innerText; 
    
    if (!this.validateInput(user, password)) {
      return;
    }
    if (!this.internetConnection.isConnected()) {
      this.showErrorDialog("No internet connection");
      return;
    }
    this.auth.login(user, password).then(() => {
      this.sync();
      this.showSuccessDialog("login was successfull", "Welcome back 😀 <br> Your vocabularies are synced at the moment ↺. This can take a bit ⏲");

    }).catch((err: HttpErrorResponse)=> {
      console.log(err);
      if (err.error != null && err.error.code == "ERR_0001" && err.status == 404) {

        let dialogRef = this.dialog.open(DialogConfirmationComponent, {
          disableClose: false
        });
        dialogRef.componentInstance.confirmTitle = "User doesn't exist yet"
        dialogRef.componentInstance.confirmMessage = "Your username doesn't exist yet. Wanna register him?";
        dialogRef.componentInstance.confirmButton = "Yes";
        dialogRef.componentInstance.cancelButton = "No";
      
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            this.auth.register(user, password).then(() => {
              this.sync();
              this.showSuccessDialog("Registration was successfull", "Welcome 😀 <br> You can not restore your account once you lost your password, so please take care of it.");
            }).catch((err: HttpErrorResponse)=> {
              console.log(err);
              this.showErrorDialog("registration was not successfull");
            })
          }
        })
      } else {
        this.showErrorDialog("login was not successfull");
      }
    })
  }

  private validateInput(user: string, password: string) :boolean {
    console.log(user);
    console.log(password);
    if (user == null || password == null) {
      this.showErrorDialog("You have to insert a password and username");
      return false;
    } 
    user = user.trim();
    password = password.trim();
    
    if (user.length == 0 || password.length == 0) {
      this.showErrorDialog("You have to insert a password and username");
      return false;
    }

    if (password.length < 4) {
      this.showErrorDialog("password must be at least 4 digits long");
      return false;
    }

    if (user.length < 4) {
      this.showErrorDialog("username must be at least 4 digits long");
      return false;
    }

    if (user.search(":") != -1 || password.search(":") != -1) {
      this.showErrorDialog("a colon (:) ist not allowed in username and password");
      return false;
    }

    return true;
  }

  private showErrorDialog(message: string) {
    let dialogRef = this.dialog.open(DialogErrorMessageComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.errorMessage = message;

    /*
    let dialogRef = this.dialog.open(DialogConfirmationComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.vocService.deleteVocabulary(this.voc).then((obj) => {
          this.snackBar.open("Vocabulary successfully deleted" , null, {duration:2000});
          this.resolve(true);
        }).catch(err => this.snackBar.open(JSON.parse(err) , null, {duration:2000}));
      }
      dialogRef = null;
    });
    */
  }

  private showSuccessDialog(title: string, message: string) {
    let dialogRef = this.dialog.open(DialogSuccessMessageComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.successTitle = title;
    dialogRef.componentInstance.successMessage = message;
  }

  private sync() {
    
      this.overlayRef = this.overlay.create({height: '100%', width: '100%'});
      const userProfilePortal = new ComponentPortal(LoadingSpinnerComponent);
      this.overlayRef.attach(userProfilePortal);
    
    let _this = this
    this.vocRest.sync().finally(function () {
      console.log("REMOVE LOADING SPINNER");
      _this.overlayRef.dispose();
      _this.overlayRef = null;
      _this.router.navigate(["../"])
    })
  }

}
