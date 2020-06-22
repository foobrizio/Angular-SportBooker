import { Component, OnInit, Input } from '@angular/core';
import { Field } from 'src/app/classes/field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookingDialogComponent } from 'src/app/components/dialog/booking-dialog/booking-dialog.component';
import { User } from 'src/app/classes/user';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { Reservation } from 'src/app/classes/reservation';
import { UserService } from 'src/app/services/user/user.service';
import { OktaAuthService } from '@okta/okta-angular';


@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  @Input() field: Field;
  imageFolder = 'assets/search/';
  imageUrl: string;

  user: User;

  constructor(public dialog: MatDialog, private resServ: ReservationService, private userServ: UserService, private okta: OktaAuthService){

   }

  ngOnInit(): void {
    switch (this.field.sport){
      case 'Calcio': this.imageUrl = this.imageFolder + 'soccer.jpg'; break;
      case 'Calcetto': this.imageUrl = this.imageFolder + 'soccer.jpg'; break;
      case 'Tennis': this.imageUrl = this.imageFolder + 'tennis.jpg'; break;
      case 'Basket': this.imageUrl = this.imageFolder + 'basket.jpg'; break;
      case 'Volley': this.imageUrl = this.imageFolder + 'volley.jpg'; break;
      case 'Rugby': this.imageUrl = this.imageFolder + 'rugby.jpg'; break;
    }
  }

  onBookClicked(): void{

    let reservationListObtained = [];
    this.getUser();
    this.resServ.getActiveReservationsForField(this.field.id).subscribe({
      next: x => {
        reservationListObtained = x;
        this.openBookingDialog(reservationListObtained);
      },
      error: err => {
        if (err.error.text === 'Field doesn\'t exist!!!'){
          console.log('Nessun campo associato all\'id');
        }
        else if (err.error.text === 'No results!!!'){
          this.openBookingDialog([]);
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      }
    });
  } // onBookClicked

  openBookingDialog(reservations: Reservation[]): void{

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      height: '400px',
      width: '600px',
      data: {
        field: this.field,
        reservationList: reservations
      }
    });

    dialogRef?.afterClosed().subscribe(result => {
      if (result){
        const reservation = result.reservation;
        const amount = result.amount;
        this.deployReservation(reservation, amount);
      }
    });
  }

  async deployReservation(res: Reservation, amount: number){

    const bookingDate = new Date(res.bookingTime);
    for (let i = 0; i < amount; i++){
      bookingDate.setHours(bookingDate.getHours() + i);
      const newRes = new Reservation();
      newRes.booker = this.user;
      newRes.field = res.field;
      newRes.bookingTime = bookingDate.getTime();

      this.resServ.addReservation(newRes).subscribe({
        next: x => {
          console.log('Tutto ok');
          console.log(x);
        },
        error: err => {
          console.log('Errore');
          console.log(err);
        }
      });

    }

  }

  async getUser(){

    const email = (await this.okta.getUser()).preferred_username;
    this.userServ.retrieveUser(email).subscribe({
      next: x => {
        this.user = User.create(x);
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });

  }
}
