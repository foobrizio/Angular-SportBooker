import { Component, OnInit, Input } from '@angular/core';
import { Field } from 'src/app/classes/field';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from 'src/app/components/dialog/booking-dialog/booking-dialog.component';
import { User } from 'src/app/classes/user';
import { ReservationService } from 'src/app/services/reservation/reservation.service';


@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  @Input() field: Field;
  imageFolder = 'assets/search/';
  imageUrl: string;

  constructor(public dialog: MatDialog, private reservationService: ReservationService) { }

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

  openDialog(): void{

    let reservationListObtained = [];
    this.reservationService.getActiveReservationsForField(this.field.id).subscribe({
      next: x => {
        reservationListObtained = x;
      },
      error: err => {
        if (err.error.text === 'Field doesn\'t exist!!!'){
          console.log('Nessun campo associato all\'id');
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => console.log('Observer è stato completato')
    });
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      height: '400px',
      width: '600px',
      data: {
        field: this.field,
        user: new User()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
}
