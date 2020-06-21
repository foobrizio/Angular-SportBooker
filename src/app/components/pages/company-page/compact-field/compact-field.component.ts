import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Field } from 'src/app/classes/field';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from 'src/app/components/dialog/booking-dialog/booking-dialog.component';
import { User } from 'src/app/classes/user';
import { ReservationService } from 'src/app/services/reservation/reservation.service';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { CompanyService } from 'src/app/services/company/company.service';
import { FieldDialogComponent } from 'src/app/components/dialog/field-dialog/field-dialog.component';

@Component({
  selector: 'app-compact-field',
  templateUrl: './compact-field.component.html',
  styleUrls: ['./compact-field.component.css']
})
export class CompactFieldComponent implements OnInit {

  @Input() field: Field;
  @Input() view: string;

  @Output() changed = new EventEmitter<string>();

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

    this.companyService.updateField(field).subscribe({
      next: x => {
        this.changed.emit('Field updated');
      }
    });

  }

  deleteField(): void{

    this.companyService.deleteField(this.field).subscribe({
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

}
