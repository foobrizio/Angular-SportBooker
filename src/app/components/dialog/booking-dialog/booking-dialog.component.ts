import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Company } from 'src/app/classes/company';
import { Field } from 'src/app/classes/field';
import { Reservation } from 'src/app/classes/reservation';
import { User } from 'src/app/classes/user';
import { SearchService } from 'src/app/services/search/search.service';


export interface DatiBooking{

  field: Field;
  user: User;
}



@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent implements OnInit {

  reservationList: Reservation[];


  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatiBooking){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
