import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { ReviewService } from 'src/app/services/review/review.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  @Input() company: Company;
  rating = 0.0;
  imageUrl = 'assets/search/company.jpg';

  constructor( private reviewService: ReviewService) { }

  ngOnInit(): void {

    this.reviewService.getRating(this.company.id).subscribe({
      next: x => {
        console.log('Abbiamo ottenuto il rating ' + x);
        this.rating = x;
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

}
