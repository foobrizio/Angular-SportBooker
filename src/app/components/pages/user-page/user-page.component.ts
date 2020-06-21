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
  reservationPageSize = 10;
  reservationPageSizeOptions = [5 , 10 , 20];

  expiredReservationList: Reservation[] = [];
  expiredReservationPageSize = 10;
  expiredReservationPageSizeOptions = [5 , 10 , 20];

  reviewList: Review[] = [];
  reviewPageSize = 10;
  reviewPageSizeOptions = [5, 10 , 20];

  companyList: Company[] = [];
  companyPageSize = 10;
  companyPageSizeOptions = [5 , 10 , 20];


  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private oktaAuth: OktaAuthService) { }

  ngOnInit(): void {

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

    this.activatedRoute.fragment.subscribe( fragment => {

      if (fragment){
        console.log('fragment');
        this.scroll(fragment);
      }
      else {
        window.scrollTo(0, 0);
      }
    });
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

        const list: Company[] = [];
        x.forEach( company => {
          const c = Company.create(company);
          list.push(c);
        });
        this.companyList = list;
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



  scroll(target: string): void{

    const where = document.getElementById(target);
    where.scrollIntoView({behavior: 'smooth'});
  }

}
