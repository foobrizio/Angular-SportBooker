import { Component, OnInit, Input } from '@angular/core';
import { Field } from 'src/app/classes/field';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from 'src/app/components/dialog/booking-dialog/booking-dialog.component';
import { User } from 'src/app/classes/user';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-compact-field',
  templateUrl: './compact-field.component.html',
  styleUrls: ['./compact-field.component.css']
})
export class CompactFieldComponent implements OnInit {

  @Input() field: Field;
  @Input() view: string;

  imageFolder = 'assets/search/';
  imageUrl: string;


  constructor(public dialog: MatDialog, private reservationService: ReservationService, private companyService: CompanyService) { }

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
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      height: '400px',
      width: '600px',
      data: {
        field: this.field,
        reservationList: reservationListObtained
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onEditClick(): void{

  }

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


  editField(): void{

    this.companyService.updateField(this.field);

  }

  deleteField(): void{

    console.log('Vogliamo cancellare un campo');
    this.field = undefined;
    this.companyService.deleteField(this.field).subscribe({
      next: x => {
        console.log(x);
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

}
