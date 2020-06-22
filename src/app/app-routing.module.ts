import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './components/search/search-page/search-page.component';
import { HomePageComponent} from './components/home/home-page/home-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CompanyPageComponent } from './components/pages/company-page/company-page.component';

import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { AuthInterceptor } from './shared/okta/auth.interceptor';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { CommonModule} from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserPageComponent } from './components/pages/user-page/user-page.component';

const oktaConfig = {
  issuer: 'https://dev-834625.okta.com/oauth2/default	',
  redirectUri: window.location.origin + '/callback',
  clientId: '0oafa5b4pHLu6y5Ww4x6',
  scopes: ['openid', 'profile']
};

const routes: Routes = [{
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
},
{
  path: 'home',
  component: HomePageComponent
},
{
  path: 'callback',
  component: OktaCallbackComponent
},
{
  path: 'search',
  pathMatch: 'prefix',
  component: SearchPageComponent
},
{
  path: 'company',
  component: CompanyPageComponent
},
{
  path: 'user',
  component: UserPageComponent
},
{
  path: '**',
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OktaAuthModule,
    RouterModule.forRoot(routes)],
  providers: [
    {provide: OKTA_CONFIG, useValue: oktaConfig},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
