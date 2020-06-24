import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user/user.service';
import { OktaAuthService } from '@okta/okta-angular';
import { Reservation } from 'src/app/classes/reservation';
import { Review } from 'src/app/classes/review';
import { Company } from 'src/app/classes/company';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: User;

  reservationList: Reservation[] = [];
  reservationQuantity: number;
  reservationPageIndex = 0;
  reservationPageSize = 10;
  reservationPageSizeOptions = [5 , 10 , 20];

  expiredReservationList: Reservation[] = [];
  expiredReservationQuantity: number;
  expiredReservationPageIndex = 0;
  expiredReservationPageSize = 10;
  expiredReservationPageSizeOptions = [5 , 10 , 20];

  reviewList: Review[] = [];
  reviewQuantity: number;
  reviewPageIndex = 0;
  reviewPageSize = 10;
  reviewPageSizeOptions = [5, 10 , 20];

  companyList: Company[] = [];
  companyQuantity: number;
  companyPageIndex = 0;
  companyPageSize = 10;
  companyPageSizeOptions = [5 , 10 , 20];


  constructor(private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private userService: UserService,
              private oktaAuth: OktaAuthService) { }

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
      }
    });

  }

  getUserData(){

    this.getActiveReservations();
    this.getExpiredReservations();
    this.getReviews();
    this.getCompanies();

    this.activatedRoute.fragment.subscribe( fragment => {

      if (fragment){
        this.scroll(fragment);
      }
      else {
        window.scrollTo(0, 0);
      }
    });
  }

  handleReservationPage(e: PageEvent){

    this.reservationPageIndex = e.pageIndex;
    this.reservationPageSize = e.pageSize;
    this.getActiveReservations();
  }

  handleExpiredReservationPage(e: PageEvent){

    this.expiredReservationPageIndex = e.pageIndex;
    this.expiredReservationPageSize = e.pageSize;
    this.getExpiredReservations();
  }

  handleReviewPage(e: PageEvent){

    this.reviewPageIndex = e.pageIndex;
    this.reviewPageSize = e.pageSize;
    this.getReviews();
  }

  handleCompanyPage(e: PageEvent){

    this.companyPageIndex = e.pageIndex;
    this.companyPageSize = e.pageSize;
    this.getCompanies();
  }

  async getActiveReservations(){

    this.userService.getActiveReservationsQuantity(this.user.email).subscribe({
      next: x => {
        this.reservationQuantity = x;
      },
      error: err => {
        console.log(err);
      }
    });

    this.userService.getActiveReservations(this.user.email, this.reservationPageIndex, this.reservationPageSize).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.reservationList = [];
        }
        else{
          this.reservationList = x;
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  } // getActiveReservations


  async getExpiredReservations(){

    this.userService.getExpiredReservationsQuantity(this.user.email).subscribe({
      next: x => {
        this.expiredReservationQuantity = x;
      },
      error: err => {
        console.log(err);
      }
    });

    this.userService.getExpiredReservations(this.user.email, this.expiredReservationPageIndex, this.expiredReservationPageSize).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.expiredReservationList = [];
        }
        else{
          this.expiredReservationList = x;
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  } // getExpiredReservations


  async getReviews(){

    this.userService.getReviewsQuantity(this.user.email).subscribe({
      next: x => {
        this.reviewQuantity = x;
      },
      error: err => {
        console.log(err);
      }
    });

    this.userService.getReviews(this.user.email, this.reviewPageIndex, this.reviewPageSize).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.reviewList = [];
        }
        else{
          this.reviewList = x;
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  } // getReviews


  async getCompanies(){

    this.userService.getCompaniesQuantity(this.user.email).subscribe({
      next: x => {
        this.companyQuantity = x;
      },
      error: err => {
        console.log(err);
      }
    });

    this.userService.getCompanies(this.user.email, this.companyPageIndex, this.companyPageSize).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.companyList = [];
        }
        else{
          const list: Company[] = [];
          x.forEach( company => {
            const c = Company.create(company);
            list.push(c);
          });
          this.companyList = list;
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  } // getCompanies


  undoReservation(res: Reservation){

    this.userService.deleteReservation(res).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'La prenotazione è stata cancellata'){
          this.getActiveReservations();
          this.snackBar.open('Prenotazione annullata', 'OK', {
          duration: 5000
          });
        }

      },
      error: err => {
          console.log(err);
      }
    });
  }

  scroll(target: string): void{

    const where = document.getElementById(target);
    where.scrollIntoView({behavior: 'smooth'});
  }

}
