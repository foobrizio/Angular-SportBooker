import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/app/classes/company';
import { CompanyService } from 'src/app/services/company/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { Field } from 'src/app/classes/field';

@Component({
  selector: 'app-compact-company',
  templateUrl: './compact-company.component.html',
  styleUrls: ['./compact-company.component.css']
})
export class CompactCompanyComponent implements OnInit {

  @Input() company: Company;
  fieldList: Field[];

  freeDayToString: string;

  constructor(public dialog: MatDialog, private companyService: CompanyService) { }

  ngOnInit(): void {

    this.retrieveFields();
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

        console.log('Vorremmo eliminare la struttura');
      }

    });
  }

  async retrieveFields() {

    this.companyService.getFields(this.company.id).subscribe({
      next: x => {
        const list: Field[] = [];
        x.forEach( field => {
          const c = Field.create(field);
          list.push(c);
        });
        this.fieldList = list;
      },
      error: err => {
        if (err.error === 'User doesn\'t exists!!!'){
          console.log('L\'utente non esiste???');
        }
        else if (err.error === 'No results!!!'){
          this.fieldList = [];
          console.log('Nessuna struttura trovata');
          console.log(err);
        }
      },
      complete: () => {
        console.log('Completato');
      }
    });

  }

}
