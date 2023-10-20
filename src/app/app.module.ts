import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MatDividerModule} from "@angular/material/divider";
import { MatNativeDateModule } from '@angular/material/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { VocabularyRestService } from './services/vocabulary-rest.service';
import { SiteSearchComponent } from './sites/search/search.component';
import { SiteMenuComponent } from './sites/menu/menu.component';
import { SiteQueryComponent } from './sites/query/query.component';
import { SiteChangeComponent } from './sites/change/change.component';
import { SiteSettingsComponent } from './sites/settings/settings.component';
import { LogoInCornerComponent } from './frames/logo-in-corner/logo-in-corner.component';
import { ButtonBackComponent } from './frames/button-back/button-back.component';
import { VarPrimaryLanguageComponent } from './frames/var-primary-language/var-primary-language.component';
import { VarSecondaryLanguageComponent } from './frames/var-secondary-language/var-secondary-language.component';
import { DialogChangeChooseUnitComponent } from './dialogs/dialog-change-choose-unit/dialog-change-choose-unit.component';
import { DialogAddVocabularyComponent } from './dialogs/dialog-add-vocabulary/dialog-add-vocabulary.component';
import { DialogQueryChooseUnitComponent } from './dialogs/dialog-query-choose-unit/dialog-query-choose-unit.component';
import { DialogQueryCheckInputComponent } from './dialogs/dialog-query-check-input/dialog-query-check-input.component';
import { DialogQueryFinalResultComponent } from './dialogs/dialog-query-final-result/dialog-query-final-result.component';
import {DialogChangeRemoveBottomSheetComponent} from './dialogs/dialog-change-remove-bottom-sheet/dialog-change-remove-bottom-sheet.component';
import { DialogConfirmationComponent } from './dialogs/dialog-confirmation/dialog-confirmation.component';
import { DialogEditVocabularyComponent } from './dialogs/dialog-edit-vocabulary/dialog-edit-vocabulary.component'
import { AuthService } from './services/auth.service';
import { LoadingSpinnerComponent } from './frames/loading-spinner/loading-spinner.component';
import { FullscreenOverlayContainer, OverlayContainer} from '@angular/cdk/overlay';
import { InterceptorService } from './services/interceptor.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginToSyncComponent } from './sites/login-to-sync/login-to-sync.component';
import { DialogErrorMessageComponent } from './dialogs/dialog-error-message/dialog-error-message.component';
import { DialogSuccessMessageComponent } from './dialogs/dialog-success-message/dialog-success-message.component';
import { ImpressumComponent } from './sites/impressum/impressum.component';

@NgModule({
    imports: [
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        RouterModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    exports: [MatButtonModule, MatFormFieldModule, MatCheckboxModule],
    declarations: [
        AppComponent,
        SiteMenuComponent,
        SiteQueryComponent,
        SiteSearchComponent,
        SiteChangeComponent,
        SiteSettingsComponent,
        LogoInCornerComponent,
        ButtonBackComponent,
        VarPrimaryLanguageComponent,
        VarSecondaryLanguageComponent,
        DialogChangeChooseUnitComponent,
        DialogAddVocabularyComponent,
        DialogQueryChooseUnitComponent,
        DialogQueryCheckInputComponent,
        DialogQueryFinalResultComponent,
        DialogChangeRemoveBottomSheetComponent,
        DialogConfirmationComponent,
        DialogEditVocabularyComponent,
        LoadingSpinnerComponent,
        LoginToSyncComponent,
        DialogErrorMessageComponent,
        DialogSuccessMessageComponent,
        ImpressumComponent,
    ],
    providers: [
        VocabularyRestService,
        AuthService,
        { provide: LoadingSpinnerComponent, useClass: FullscreenOverlayContainer },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
