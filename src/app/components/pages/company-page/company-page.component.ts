import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { ReviewService } from 'src/app/services/review/review.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';
import { Field } from 'src/app/classes/field';
import { Review } from 'src/app/classes/review';
import { Reservation } from 'src/app/classes/reservation';
import { UserService } from 'src/app/services/user/user.service';
import { OktaAuthService } from '@okta/okta-angular';
import { User } from 'src/app/classes/user';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../../dialog/review-dialog/review-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {

  user: User;
  company: Company;
  opening: string;
  closing: string;
  rating: number;
  reviewOrder: string;

  neverLeft: boolean;
  reviewList: Review[];
  reviewPageIndex = 0;
  reviewPageSize = 10;
  reviewPageSizeOptions = [5, 10, 20];

  fieldList: Field[];
  fieldQuantity: number;
  fieldPageIndex = 0;
  fieldPageSize = 10;
  fieldPageSizeOptions = [5, 10, 20];

  reservationList: Reservation[];
  constructor(private reviewService: ReviewService, private companyService: CompanyService, private activatedRoute: ActivatedRoute,
              private userServ: UserService, private okta: OktaAuthService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    window.scrollTo(0 , 0);
    this.reviewOrder = 'best';
    this.getParams();
    this.getUser();
  }



  getParams(){


    this.activatedRoute.queryParams.subscribe( params => {

      const companyId = params.id;
      this.companyService.getCompany(companyId).subscribe({
        next: x => {
          const message: any = x;
          if (message.message === 'Company doesn\'t exist!!!'){
            console.log('Nessuna struttura associata all\'id');
          }
          else{
            this.company = Company.create(x);
            this.opening = String(this.company.openingTime).substring(0, 5);
            this.closing = String(this.company.closingTime).substring(0, 5);
            this.getCompanyData();
          }
        },
        error: err => {
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      });
    }); // subscribe
  } // getParams



  async getUser(){

    const email = (await this.okta.getUser()).preferred_username;
    await this.userServ.retrieveUser(email).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'User doesn\'t exist!!!'){
          console.log('L\'utente non esiste');
        }
        else{
          this.user = User.create(x);
          this.checkIfExistsReview();
        }
      },
      error: err => {
        console.log(err);
      }
    });

  }


  getFragment(): void{
    this.activatedRoute.fragment.subscribe( fragment => {

      this.scroll(fragment);
    });
  }


  async getCompanyData(){

    // prendiamo prima rating e reviews
    this.getReviews();
    // poi prendiamo la lista di campi
    this.getFields();
    // infine prendiamo le prenotazioni
    this.getOldReservations();
  }

  handleFieldPage(e: PageEvent){

    this.fieldPageIndex = e.pageIndex;
    this.fieldPageSize = e.pageSize;
    console.log({index: this.fieldPageIndex, size: this.fieldPageSize});
    this.getFields();
  }

  handleReviewPage(e: PageEvent){

    this.reviewPageIndex = e.pageIndex;
    this.reviewPageSize = e.pageSize;
    this.getReviews();
  }

  async getFields(){

    this.companyService.getFieldQuantity(this.company.id).subscribe({
      next: x => {
        console.log(x);
        this.fieldQuantity = x;

      },
      error: err => {

      }
    });
    this.companyService.getFields(this.company.id, this.fieldPageIndex, this.fieldPageSize).subscribe({
      next: x => {
        if (x){
          this.fieldList = x;
        }
        else {
          this.fieldList = [];
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  }

  async getReviews(){

    // prendiamo il rating
    this.reviewService.getRating(this.company.id).subscribe({
      next: x => {
        this.rating = x;
        this.getFragment();
      },
      error: err => {
        if (err.error.text === 'No results!!!'){
          this.rating = 0.0;
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      }
    });

    // ora prendiamo la lista di recensioni
    this.companyService.getReviews(this.company.id, this.reviewPageIndex, this.reviewPageSize, this.reviewOrder).subscribe({
      next: x => {
        if (x){
          const list = [];
          x.forEach( review => {
            list.push(Review.create(review));
          });
          this.reviewList = list;
        }
        else{
          this.reviewList = [];
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  }

  async getOldReservations(){

    this.companyService.getOldReservations(this.company.id).subscribe({
      next: x => {
        if (x){
          this.reservationList = x;
        }
        else{
          this.reservationList = [];
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }

    });
  }


  scroll(target: string): void{

    const where = document.getElementById(target);
    where?.scrollIntoView({behavior: 'smooth'});
  }

  toggleReviewOrder(value: string): void{

    this.reviewOrder = value;
    this.getReviews();
  }

  howManyEmptyStars(): number{

    if (this.rating < 0.5){
      return 5;
    }
    if (this.rating < 1.5){
      return 4;
    }
    if (this.rating < 2.5){
      return 3;
    }
    if (this.rating < 3.5){
      return 2;
    }
    if (this.rating < 4.5){
      return 1;
    }
    return 0;
  }

  howManyFullStars(): number{

    if (this.rating < 1){
      return 0;
    }
    if (this.rating < 2){
      return 1;
    }
    if (this.rating < 3){
      return 2;
    }
    if (this.rating < 4){
      return 3;
    }
    if (this.rating < 5){
      return 4;
    }
    return 5;
  }

  hasHalfStar(): boolean{

    const decimal = this.rating % 1;
    if (decimal >= 0.5){
      return true;
    }
    return false;
  }

  getNumberOfFields(sport: string): number{

    let cont = 0;
    this.fieldList.forEach(field => {
      if (field.sport === sport){
        cont++;
      }
    });
    return cont;
  }


  async checkIfExistsReview() {

    this.reviewService.existsByUserAndCompany(this.user, this.company).subscribe({
      next: x => {
        const message: any = x;
        console.log(message.message);
        if (message.message === 'false'){
          this.neverLeft = true;

        }
        else if (message.message === 'true'){
          this.neverLeft = false;

        }

      },
      error: err => {
        console.log(err);
        if (err.error.text === 'User doesn\'t exist!!!'){
          console.log('L\'utente non è stato trovato');
        }
        else if (err.error.text === 'Company doesn\'t exist!!!'){
          console.log('La struttura non è stata trovata');
        }
      }
    });
  }

  onReviewButtonClick(): void{


    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      height: '300px',
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe( result => {

      if (result){
        this.addReview(result.comment, result.vote);
      }
    });
  }

  async addReview(comment: string, vote: number){

    const review = new Review();
    review.comment = comment;
    review.company = this.company;
    review.reviewer = this.user;
    review.vote = vote;
    this.reviewService.addReview(review).subscribe({
      next: x => {
        console.log(x);
        this.snackBar.open('Grazie per la recensione', 'OK', {
          duration: 5000
        });
        this.checkIfExistsReview();
        this.getReviews();
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
