import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Field } from 'src/app/classes/field';
import { Reservation } from 'src/app/classes/reservation';
import { FormBuilder, Validators } from '@angular/forms';


export interface DatiBooking{

  field: Field;
  reservationList: Reservation[];
}



@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent implements OnInit {

  selectedTime: string;
  selectedDate: Date;
  selectedAmount: number;
  result: any;

  availableHours: string[];
  hoursInARow: number[];
  minDate: Date;

  amountAvailable: boolean;
  // isClosed: boolean;

  myFilter = (date: Date): boolean => {
    const day = date.getDay();
    // Evitiamo che il giorno libero della struttura sia selezionabile
    // this.isClosed = day === this.data.field.ownerCompany.freeDay;
    return day !== this.data.field.ownerCompany.freeDay;
  }


  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatiBooking, private fb: FormBuilder){}


  ngOnInit(): void {

    if (new Date().getDay() === this.data.field.ownerCompany.freeDay){
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.minDate = tomorrow;
    }
    else{
      this.minDate = new Date();
    }
    this.setAvailableHours();
    this.selectedAmount = 1;
    this.hoursInARow = [1, 2, 3];
    this.amountAvailable = true;
    // this.isClosed = false;
    this.selectedDate = this.minDate;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void{

    if (this.checkIfClosable()){
      if (!this.checkAvailability()){
        document.getElementById('alert').style.display = 'block';
      }
      else{
        this.makeReservation();
        this.dialogRef.close(this.result);
      }
    }else{

    }
  }

  checkIfClosable(): boolean{

    if (this.selectedDate !== undefined && this.selectedTime !== undefined && this.selectedAmount !== undefined){
      return true;
    }
    else{
      if (this.selectedDate === undefined){
        document.getElementById('dateField').style.border = '1px solid red';
      }
      if (this.selectedTime === undefined){
        document.getElementById('timeField').style.border = '1px solid red';
      }
      if (this.selectedAmount === undefined){
        document.getElementById('numHoursField').style.border = '1px solid red';
      }
    }
    return false;
  }

  makeReservation(): void{

    const res = new Reservation();
    res.field = this.data.field;
    const bookingDate = new Date(this.selectedDate);
    const bookingHour = Number.parseInt(this.selectedTime.substring(0 , 2) , 10);
    bookingDate.setHours(bookingHour);
    bookingDate.setMinutes(0);
    bookingDate.setSeconds(0);
    bookingDate.setMilliseconds(0);
    res.bookingTime = bookingDate.getTime();
    this.result = {reservation: res,  amount: this.selectedAmount};
  }


  /* Metodo che si occupa di verificare se la data scelta è ammissibile, e setta di conseguenza il range di ore */
  deepControl(): void{


    if (new Date().getDay() === this.data.field.ownerCompany.freeDay){
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.minDate = tomorrow;
    }
    this.setAvailableHours();


  }
  setAvailableHours(): void{

    const rightNow = new Date();
    this.availableHours = [];
    let maxHour = Number.parseInt(String(this.data.field.ownerCompany.closingTime).substring(0, 2), 10);
    if (maxHour === 0){
      maxHour = 24;
    }
    let minHour = rightNow.getHours();
    let ok = false;
    while (!ok){
      /* il minimo orario deve essere il primo disponibile. Dobbiamo quindi dare anche uno sguardo alle prenotazioni già attive */
      minHour += 1;
      if (this.selectedDate?.getDay() === rightNow.getDay()){ /* Vogliamo prenotare un campo nella data odierna

        /* Si può prenotare un campo minimo con mezzora di anticipo */
        if (rightNow.getMinutes() > 30){
          minHour = rightNow.getHours() + 2;
        }
      }
      else{ /* Vogliamo prenotare un campo in un giorno diverso da oggi */
        minHour = Number.parseInt(String(this.data.field.ownerCompany.openingTime).substring(0, 2), 10);
      }
      ok = !this.checkIfAlreadyBooked(minHour);
      if (!ok){
        if ( maxHour - minHour < 2){
          /* Arrivati a questo punto è inutile cercare altre date libere nella giornata odierna. */
          rightNow.setDate(rightNow.getDate() + 1);
          minHour =  Number.parseInt(String(this.data.field.ownerCompany.openingTime).substring(0, 2), 10);
          rightNow.setHours(minHour);
          this.minDate = rightNow;
        }
      }
    }
    for (let i = minHour; i < maxHour; i++){
      if (i < 10){
        this.availableHours.push(i + ' ');
      }
      else{
        this.availableHours.push(i + '');
      }
    }
  }


  checkIfAlreadyBooked(hour: number): boolean{

    let booked = false;
    this.data.reservationList?.forEach( reservation => {

      const reserveDate = new Date(reservation.bookingTime);
      const reserveDay = reserveDate.getDate();
      const reserveMonth = reserveDate.getMonth();
      const reserveHour = reserveDate.getHours();
      if (reserveDay === this.selectedDate?.getDate() && reserveMonth === this.selectedDate?.getMonth()){

        /* Abbiamo una prenotazione nella giornata odierna */
        if (reserveHour === hour){
          booked = true;
        }
      }
    }); // forEach
    return booked;
  }

  /* serve per valutare se possiamo inserire il numero di ore di fila scelto */
  checkAvailability(): boolean {

    let available = true;
    const selectedHour = Number.parseInt(this.selectedTime?.substring(0, 2), 10);
    for (let i = 0; i < this.selectedAmount ; i++){
      available = !this.checkIfAlreadyBooked(selectedHour + i);
      if (!available){
        break;
      }
    }
    this.amountAvailable = available;
    return available;
  }


  getMaxDate(): Date{

    const today = new Date();
    today.setDate(this.minDate?.getDate() + 7);
    return today;
  }



  setHoursInARow(): void{

    const selectedHour = Number.parseInt(this.selectedTime.substring(0, 2), 10);
    let closingHour = Number.parseInt(String(this.data.field.ownerCompany.closingTime).substring(0, 2), 10);
    if (closingHour === 0){
      closingHour = 24;
    }
    let interval = closingHour - selectedHour;
    if (interval > 3){
      interval = 3;
    }
    this.hoursInARow = [];
    for (let i = 0; i < interval; i++){
      this.hoursInARow.push(i + 1);
    }
  }


  getHoursInARow(): number[]{

    return this.hoursInARow;
  }
}
