import { Component, OnInit, Input } from '@angular/core';
import { Review } from 'src/app/classes/review';

@Component({
  selector: 'app-compact-review',
  templateUrl: './compact-review.component.html',
  styleUrls: ['./compact-review.component.css']
})
export class CompactReviewComponent implements OnInit {

  @Input() review: Review;

  constructor() { }

  ngOnInit(): void {
  }

  howManyFullStars(): number{

    const vote = this.review.vote;
    if (vote < 2){ return 1; }
    if (vote < 3){ return 2; }
    if (vote < 4){ return 3; }
    if (vote < 5){ return 4; }
    return 5;
  }

  howManyEmptyStars(): number{

    const vote = this.review.vote;
    if (vote < 1.5){ return 4; }
    if (vote < 2.5){ return 3; }
    if (vote < 3.5){ return 2; }
    if (vote < 4.5){ return 1; }
    return 0;
  }

  hasHalfStar(): boolean {

    return this.howManyFullStars() + this.howManyEmptyStars() !== 5;
  }

  getData(): string {

    const date = new Date(this.review.publishTime);
    const options = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
    return date.toLocaleString('it-IT', options);
  }

}
