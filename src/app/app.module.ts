import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDividerModule } from "@angular/material/divider";
import { MatNativeDateModule } from '@angular/material/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { DialogChangeRemoveBottomSheetComponent } from './dialogs/dialog-change-remove-bottom-sheet/dialog-change-remove-bottom-sheet.component';
import { DialogConfirmationComponent } from './dialogs/dialog-confirmation/dialog-confirmation.component';
import { DialogEditVocabularyComponent } from './dialogs/dialog-edit-vocabulary/dialog-edit-vocabulary.component'
import { AuthService } from './services/auth.service';
import { LoadingSpinnerComponent } from './frames/loading-spinner/loading-spinner.component';
import { FullscreenOverlayContainer } from '@angular/cdk/overlay';

import { DialogErrorMessageComponent } from './dialogs/dialog-error-message/dialog-error-message.component';
import { DialogSuccessMessageComponent } from './dialogs/dialog-success-message/dialog-success-message.component';
import { ImpressumComponent } from './sites/impressum/impressum.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: environment.auth.URL,
                realm: environment.auth.REALM,
                clientId: environment.auth.CLIENT_ID
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/silent-check-sso.html'
            },
            loadUserProfileAtStartUp: true
        });
}

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
        KeycloakAngularModule,
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
        DialogErrorMessageComponent,
        DialogSuccessMessageComponent,
        ImpressumComponent,
    ],
    providers: [
        VocabularyRestService,
        AuthService,
        { provide: LoadingSpinnerComponent, useClass: FullscreenOverlayContainer },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
