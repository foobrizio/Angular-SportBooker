import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {

  review: string;
  vote: number;

  myForm = this.fb.group({

    review: ['', [Validators.required]]
  });

  constructor(public dialogRef: MatDialogRef<ReviewDialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.vote = 5;
  }

  setStar(vote: number){

    this.vote = vote;
    switch (this.vote){
      case 1: this.oneStar(); break;
      case 2: this.twoStars(); break;
      case 3: this.threeStars(); break;
      case 4: this.fourStars(); break;
      case 5: this.fiveStars(); break;
    }
  }

  oneStar(): void{

    document.getElementById('star2').innerHTML = 'star_border';
    document.getElementById('star3').innerHTML = 'star_border';
    document.getElementById('star4').innerHTML = 'star_border';
    document.getElementById('star5').innerHTML = 'star_border';
  }

  twoStars(): void{

    document.getElementById('star2').innerHTML = 'star';
    document.getElementById('star3').innerHTML = 'star_border';
    document.getElementById('star4').innerHTML = 'star_border';
    document.getElementById('star5').innerHTML = 'star_border';
  }

  threeStars(): void{

    document.getElementById('star2').innerHTML = 'star';
    document.getElementById('star3').innerHTML = 'star';
    document.getElementById('star4').innerHTML = 'star_border';
    document.getElementById('star5').innerHTML = 'star_border';
  }

  fourStars(): void{

    document.getElementById('star2').innerHTML = 'star';
    document.getElementById('star3').innerHTML = 'star';
    document.getElementById('star4').innerHTML = 'star';
    document.getElementById('star5').innerHTML = 'star_border';
  }

  fiveStars(): void{

    document.getElementById('star2').innerHTML = 'star';
    document.getElementById('star3').innerHTML = 'star';
    document.getElementById('star4').innerHTML = 'star';
    document.getElementById('star5').innerHTML = 'star';
  }
  onNoClick(): void{

    this.dialogRef.close();
  }

  onYesClick(): void{

    this.dialogRef.close({comment: this.myForm.controls.review.value, vote: this.vote});
  }

}
