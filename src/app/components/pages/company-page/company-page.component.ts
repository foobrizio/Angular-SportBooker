import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { ReviewService } from 'src/app/services/review/review.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';
import { Field } from 'src/app/classes/field';
import { Review } from 'src/app/classes/review';
import { Reservation } from 'src/app/classes/reservation';

@Component({
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {

  company: Company;
  opening: string;
  closing: string;
  rating: number;
  reviewOrder: string;
  reviewList: Review[];
  reviewPageSize = 10;
  reviewPageSizeOptions = [5, 10, 20];

  fieldList: Field[];
  fieldPageSize = 10;
  fieldPageSizeOptions = [5, 10, 20];

  reservationList: Reservation[];

  constructor(private reviewService: ReviewService, private companyService: CompanyService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    window.scrollTo(0 , 0);
    this.reviewOrder = 'Le migliori';
    this.getParams();
  }


  getParams(): void{


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
          }
        },
        error: err => {
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        },
        complete: () => console.log('Observer è stato completato')
      });

      this.getCompanyData(companyId);
    }); // subscribe

  } // getParams


  getFragment(): void{
    this.activatedRoute.fragment.subscribe( fragment => {

      this.scroll(fragment);
    });
  }


  getCompanyData(companyId: number){

    // prendiamo il rating
    this.reviewService.getRating(companyId).subscribe({
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
      },
      complete: () => console.log('Observer è stato completato')
    });

    // ora prendiamo la lista di recensioni
    this.companyService.getReviews(companyId).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.reviewList = [];
        }
        else{
          const list = [];
          x.forEach( review => {
            list.push(Review.create(review));
          });
          this.reviewList = list;
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });

    // infine prendiamo la lista di campi
    this.companyService.getFields(companyId).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!' || message.message === 'Company doesn\'t exist!!!'){
          this.fieldList = [];
        }
        else{
          this.fieldList = x;
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });

    this.companyService.getOldReservations(companyId).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!' || message.message === 'Company doesn\'t exist!!!'){
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

  }


  scroll(target: string): void{

    const where = document.getElementById(target);
    where?.scrollIntoView({behavior: 'smooth'});
  }

  toggleReviewOrder(value: string): void{

    this.reviewOrder = value;

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

}
