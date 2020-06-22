import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Reservation } from 'src/app/classes/reservation';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-compact-reservation',
  templateUrl: './compact-reservation.component.html',
  styleUrls: ['./compact-reservation.component.css']
})
export class CompactReservationComponent implements OnInit {

  @Input() reservation: Reservation;
  @Output() undone = new EventEmitter<Reservation>();
  date: string;
  active: boolean;


  constructor(public dialog: MatDialog) { }


  ngOnInit(): void {
    if ( new Date().getTime() < this.reservation.bookingTime){
      this.active = true;
    }
    else{
      this.active = false;
    }
    this.makeDate();
  }

  makeDate(): void {

    const data = new Date(this.reservation.bookingTime);
    const year = data.getFullYear();
    const day = data.getDate();
    const month = data.getMonth();
    const hour = data.getHours();
    const minute = data.getMinutes();
    let minuteString: string;
    if (minute < 10){
      minuteString = '0' + String(minute);
    }
    else{
      minuteString = String(minute);
    }
    this.date = String(day) + ' ' + this.getMonthInString(month) + ' ' + String(year) + ', ' + String(hour) + ':' + minuteString;
  }


  getMonthInString(month: number): string{

    switch (month){
      case 0 : return 'Gennaio'; break;
      case 1 : return 'Febbraio'; break;
      case 2 : return 'Marzo'; break;
      case 3 : return 'Aprile'; break;
      case 4 : return 'Maggio'; break;
      case 5 : return 'Giugno'; break;
      case 6 : return 'Luglio'; break;
      case 7 : return 'Agosto'; break;
      case 8 : return 'Settembre'; break;
      case 9 : return 'Ottobre'; break;
      case 10 : return 'Novembre'; break;
      case 11 : return 'Dicembre'; break;
    }
  }

  onUndoClick(): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe( result => {
      if (typeof(result) === 'boolean' && result){
        this.undone.emit(this.reservation);
      }
    });


  }

}
