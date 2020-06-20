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

}
