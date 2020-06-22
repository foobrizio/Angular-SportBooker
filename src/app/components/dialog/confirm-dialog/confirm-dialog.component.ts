import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  confirmed: boolean;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit(): void {

  }

  noClicked(): void{

    this.confirmed = false;
    this.dialogRef.close(this.confirmed);
  }

  yesClicked(): void{

    this.confirmed = true;
    this.dialogRef.close(this.confirmed);

  }

}
