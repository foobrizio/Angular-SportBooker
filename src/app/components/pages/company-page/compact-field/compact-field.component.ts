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
import { MatSnackBar } from '@angular/material/snack-bar';

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
              private userServ: UserService, private okta: OktaAuthService, private snackBar: MatSnackBar) { }

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
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.openBookingDialog([]);
        }
        else if (message.message === 'Field doesn\'t exist!!!'){
          console.log('Nessun campo associato all\' id');
        }
        else{
          reservationListObtained = x;
          this.openBookingDialog(reservationListObtained);
        }
      },
      error: err => {
        console.log(err);
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
          const message: any = x;
          if (message.message === 'Campo già occupato'){
            console.log('Campo già occupato');
            this.snackBar.open('Campo già occupato', 'OK', {
              duration: 5000
            });
          }
          else{
            this.snackBar.open('Prenotazione effettuata con successo', 'OK', {
              duration: 5000
            });
          }
        },
        error: err => {
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
        const message: any = x;
        if (message.message === 'Company doesn\'t exist!!!'){
          console.log('La struttura non esiste');
        }
        else if (message.message === 'Field doesn\'t exist!!!'){
          console.log('Il campo non esiste');
        }
        else{
          this.snackBar.open('Campo modificato con successo', 'OK', {
            duration: 5000
          });
          this.changed.emit('Field updated');
        }
      },
      error: err => {
        console.log(err);
      }
    });

  }

  deleteField(): void{

    this.compServ.deleteField(this.field).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'Field doesn\'t exist!!!'){
          console.log('Il campo non è stato trovato');
        }
        else if (message.message === 'Field deleted successfully'){
          this.snackBar.open('Campo eliminato correttamente', 'OK', {
            duration: 5000
          });
          this.changed.emit('Field deleted');
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  } // deleteField


  async getUser(){

    const email = (await this.okta.getUser()).preferred_username;
    this.userServ.retrieveUser(email).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'User doesn\'t exist!!!'){
          console.log('L\'utente non esiste');
        }
        else{
          this.user = User.create(x);
        }
      },
      error: err => {
        console.log(err);
      }
    });

  }

}
