import { ImpressumComponent } from './sites/impressum/impressum.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSearchComponent } from './sites/search/search.component';
import { SiteMenuComponent } from './sites/menu/menu.component';
import { SiteQueryComponent } from './sites/query/query.component';
import { SiteChangeComponent } from './sites/change/change.component';
import { SiteSettingsComponent } from './sites/settings/settings.component';
import {KeycloakGuard} from './keycloak.guard';

const routes: Routes = [
      { path: '', component: SiteMenuComponent},
      { path: 'query/:clas/:unit', component: SiteQueryComponent},
      { path: 'query/:clas', component: SiteQueryComponent},
      { path: 'search', component: SiteSearchComponent},
      { path: 'change/:clas/:unit', component: SiteChangeComponent},
      { path: 'settings/impressum', component: ImpressumComponent },
      { path: 'settings', component: SiteSettingsComponent },
      { path: '**', redirectTo: ''}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
