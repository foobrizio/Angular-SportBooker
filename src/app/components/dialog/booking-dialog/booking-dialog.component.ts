import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Company } from 'src/app/classes/company';
import { Field } from 'src/app/classes/field';
import { Reservation } from 'src/app/classes/reservation';
import { User } from 'src/app/classes/user';
import { SearchService } from 'src/app/services/search/search.service';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/select';


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

  selectedTime: string;
  selectedDate: Date;
  selectedAmount: number;

  availableHours: string[];
  hoursInARow: number[];


  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatiBooking){}


  ngOnInit(): void {

    this.selectedDate = new Date();
    this.setAvailableHours();
    this.selectedAmount = 1;
    this.hoursInARow = [1, 2, 3];
  }



  onNoClick(): void {
    this.dialogRef.close();
    const now = new Date();
    let hour: string;
    if (now.getHours() < 10){
      hour = String(now.getHours()) + ' ';
    }
    else{
      hour = String(now.getHours());
    }
  }


  setAvailableHours(): void{

    this.availableHours = [];
    let maxHour = Number.parseInt(String(this.data.field.ownerCompany.closingTime).substring(0, 2), 10);
    if (maxHour === 0){
      maxHour = 24;
    }
    let minHour: number;
    if (this.selectedDate?.getDay() === new Date().getDay()){
      minHour = new Date().getHours();
    }
    else{
      minHour = Number.parseInt(String(this.data.field.ownerCompany.openingTime).substring(0, 2), 10);
    }
    for (let i = minHour + 1; i < maxHour; i++){
      if (i < 10){
        this.availableHours.push(i + ' ');
      }
      else{
        this.availableHours.push(i + '');
      }
    }
  }



  getMinDate(): Date{
    return new Date();
  }



  getMaxDate(): Date{
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today;
  }



  setHoursInARow(): void{

    const selectedHour = Number.parseInt(this.selectedTime.substring(1, 3), 10);
    let closingHour = Number.parseInt(String(this.data.field.ownerCompany.closingTime).substring(0, 2), 10);
    if (closingHour === 0){
      closingHour = 24;
    }
    let interval = closingHour - selectedHour;
    if (interval > 3){
      interval = 3;
    }
    console.log(closingHour);
    this.hoursInARow = [];
    for (let i = 0; i < interval; i++){
      this.hoursInARow.push(i + 1);
    }
    console.log(this.hoursInARow);

  }
  getHoursInARow(): number[]{

    return this.hoursInARow;
  }


  setReservationList( list: Reservation[]){

    this.reservationList = list;
  }
}
