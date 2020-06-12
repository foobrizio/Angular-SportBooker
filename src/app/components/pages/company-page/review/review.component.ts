import { Component, OnInit, Input } from '@angular/core';
import { Review } from 'src/app/classes/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  date: string;
  @Input() review: Review;
  constructor() { }

  ngOnInit(): void {

    const data = new Date(this.review.publishTime);
    this.date = data.toString().substring(3 , 15);
  }

}
