import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Field } from 'src/app/classes/field';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from 'src/app/components/dialog/booking-dialog/booking-dialog.component';
import { User } from 'src/app/classes/user';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { CompanyService } from 'src/app/services/company/company.service';
import { FieldDialogComponent } from 'src/app/components/dialog/field-dialog/field-dialog.component';
import { UserService } from 'src/app/services/user/user.service';
import { OktaAuthService } from '@okta/okta-angular';
import { Reservation } from 'src/app/classes/reservation';

@Component({
  selector: 'app-compact-field',
  templateUrl: './compact-field.component.html',
  styleUrls: ['./compact-field.component.css']
})
export class CompactFieldComponent implements OnInit {

  @Input() field: Field;
  @Input() view: string;
  user: User;

  @Output() changed = new EventEmitter<string>();

  imageFolder = 'assets/search/';
  imageUrl: string;


  constructor(public dialog: MatDialog, private resServ: ReservationService, private compServ: CompanyService,
              private userServ: UserService, private okta: OktaAuthService) { }

  ngOnInit(): void {
    switch (this.field.sport){
      case 'Calcio': this.imageUrl = this.imageFolder + 'soccer.jpg'; break;
      case 'Calcetto': this.imageUrl = this.imageFolder + 'soccer.jpg'; break;
      case 'Tennis': this.imageUrl = this.imageFolder + 'tennis.jpg'; break;
      case 'Basket': this.imageUrl = this.imageFolder + 'basket.jpg'; break;
      case 'Volley': this.imageUrl = this.imageFolder + 'volley.jpg'; break;
      case 'Rugby': this.imageUrl = this.imageFolder + 'rugby.jpg'; break;
    }
    if (this.view === undefined){
      this.view = 'customer';
    }
  }


  onBookClicked(): void {

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

  }

  openBookingDialog(res: Reservation[]): void{

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      height: '400px',
      width: '600px',
      data: {
        field: this.field,
        reservationList: res
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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



  /* Modifica il campo */
  onEditClick(): void{

    const dialogRef = this.dialog.open(FieldDialogComponent, {
      height: '450px',
      width: '800px',
      data: {field: this.field, mode: 'edit', from: 'inside'}
    });

    dialogRef.afterClosed().subscribe( result => {

      const editedField = Field.create(result);
      this.editField(editedField);
    });

  }

  /* Elimina il campo */
  onDeleteClick(): void{

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe( result => {
      if (typeof(result) === 'boolean' && result){
        this.deleteField();
      }
    });
  }


  editField(field: Field): void{

    this.compServ.updateField(field).subscribe({
      next: x => {
        this.changed.emit('Field updated');
      }
    });

  }

  deleteField(): void{

    this.compServ.deleteField(this.field).subscribe({
      next: x => {
        console.log(x);
        this.changed.emit('Field deleted');
      },
      error: err => {
        if (err.error.text === 'Field doesn\'t exist!!!'){
          console.log('Nessun campo associato all\'id');
        }
        else if (err.error.text === 'No results!!!'){
          console.log('No results!!!');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => console.log('Observer è stato completato')

    });


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
