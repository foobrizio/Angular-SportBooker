import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user/user.service';
import { OktaAuthService } from '@okta/okta-angular';
import { Reservation } from 'src/app/classes/reservation';
import { Review } from 'src/app/classes/review';
import { Company } from 'src/app/classes/company';

@Component({
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: User;
  reservationList: Reservation[] = [];
  expiredReservationList: Reservation[] = [];
  reviewList: Review[] = [];
  companyList: Company[] = [];

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private oktaAuth: OktaAuthService) { }

  ngOnInit(): void {

    window.scrollTo(0, 0);
    this.initUser();
  }

  async initUser(){

    const email = (await this.oktaAuth.getUser()).preferred_username;
    this.userService.retrieveUser(email).subscribe({
      next: x => {
        this.user = x;
        this.getUserData();
      },
      error: err => {
        if (err.error === 'User doesn\'t exist!!!'){
          console.log('L\'utente sta accedendo per la prima volta');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => { console.log('Completed'); }
    });

  }

  getUserData(){

    this.getActiveReservations();
    this.getExpiredReservations();
    this.getReviews();
    this.getCompanies();


  }

  async getActiveReservations(){

    this.userService.getActiveReservations(this.user.email).subscribe({
      next: x => {
        this.reservationList = x;
      },
      error: err => {
        if (err.error === 'User doesn\'t exist!!!'){
          console.log('L\'utente sta accedendo per la prima volta');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => { console.log('Completed'); }
    });
  } // getActiveReservations


  async getExpiredReservations(){

    this.userService.getExpiredReservations(this.user.email).subscribe({
      next: x => {
        this.expiredReservationList = x;
      },
      error: err => {
        if (err.error === 'User doesn\'t exist!!!'){
          console.log('L\'utente sta accedendo per la prima volta');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => { console.log('Completed'); }
    });
  } // getExpiredReservations


  async getReviews(){

    this.userService.getReviews(this.user.email).subscribe({
      next: x => {
        this.reviewList = x;
      },
      error: err => {
        if (err.error === 'User doesn\'t exist!!!'){
          console.log('L\'utente sta accedendo per la prima volta');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => { console.log('Completed'); }
    });
  } // getReviews


  async getCompanies(){

    this.userService.getCompanies(this.user.email).subscribe({
      next: x => {
        this.companyList = x;
      },
      error: err => {
        if (err.error === 'User doesn\'t exist!!!'){
          console.log('L\'utente sta accedendo per la prima volta');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => { console.log('Completed'); }
    });
  } // getCompanies

}
