import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './components/search/search-page/search-page.component';
import { HomePageComponent} from './components/home/home-page/home-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CompanyPageComponent } from './components/pages/company-page/company-page.component';


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
  path: 'search',
  pathMatch: 'prefix',
  component: SearchPageComponent
},
{
  path: 'company',
  component: CompanyPageComponent
},
{
  path: '**',
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
