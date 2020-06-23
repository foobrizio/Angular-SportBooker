import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { StatisticsComponent } from 'src/app/components/pages/home/statistics/statistics.component';
import { SportComponent } from './components/pages/home/sport/sport.component';
import { SearchPageComponent } from './components/pages/search/search-page/search-page.component';
import { HomePageComponent } from './components/pages/home/home-page/home-page.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FieldListComponent } from './components/pages/search/list/field-list/field-list.component';
import { CompanyListComponent } from './components/pages/search/list/company-list/company-list.component';
import { FieldComponent } from './components/pages/search/list/field/field.component';
import { CompanyComponent } from './components/pages/search/list/company/company.component';
import { CompanyPageComponent } from './components/pages/company-page/company-page.component';
import { CompactFieldComponent } from './components/pages/company-page/compact-field/compact-field.component';
import { ReviewComponent } from './components/pages/company-page/review/review.component';
import { BookingDialogComponent } from './components/dialog/booking-dialog/booking-dialog.component';
import { UserPageComponent } from './components/pages/user-page/user-page.component';
import { UserService } from './services/user/user.service';
import { CompanyDialogComponent } from './components/dialog/company-dialog/company-dialog.component';
import { FieldDialogComponent } from './components/dialog/field-dialog/field-dialog.component';
import { CompactCompanyComponent } from './components/pages/user-page/compact-company/compact-company.component';
import { CompactReviewComponent } from './components/pages/user-page/compact-review/compact-review.component';
import { CompactReservationComponent } from './components/pages/user-page/compact-reservation/compact-reservation.component';
import { ConfirmDialogComponent } from './components/dialog/confirm-dialog/confirm-dialog.component';
import { ReviewDialogComponent } from './components/dialog/review-dialog/review-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    StatisticsComponent,
    SportComponent,
    SearchPageComponent,
    HomePageComponent,
    PageNotFoundComponent,
    ToolbarComponent,
    FieldListComponent,
    CompanyListComponent,
    FieldComponent,
    CompanyComponent,
    CompanyPageComponent,
    CompactFieldComponent,
    ReviewComponent,
    BookingDialogComponent,
    UserPageComponent,
    CompanyDialogComponent,
    FieldDialogComponent,
    CompactCompanyComponent,
    CompactReviewComponent,
    CompactReservationComponent,
    ConfirmDialogComponent,
    ReviewDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
