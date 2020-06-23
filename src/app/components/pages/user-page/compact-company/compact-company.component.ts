import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Company } from 'src/app/classes/company';
import { CompanyService } from 'src/app/services/company/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/dialog/confirm-dialog/confirm-dialog.component';
import { Field } from 'src/app/classes/field';
import { FieldDialogComponent } from 'src/app/components/dialog/field-dialog/field-dialog.component';
import { CompanyDialogComponent } from 'src/app/components/dialog/company-dialog/company-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-compact-company',
  templateUrl: './compact-company.component.html',
  styleUrls: ['./compact-company.component.css']
})
export class CompactCompanyComponent implements OnInit {

  @Input() company: Company;
  fieldList: Field[];
  @Output() companyChanged: EventEmitter<string> = new EventEmitter<string>();

  freeDayToString: string;

  constructor(public dialog: MatDialog, private companyService: CompanyService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.retrieveFields();
  }


  /* Modifica i dati della struttura */
  onEditClick(): void{

    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      height: '450px',
      width: '800px',
      data: { company: this.company,  mode: 'edit'}
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === undefined || result === null){
        return;
      }
      this.editCompany(result);
    });
  }


  /* Elimina la struttura */
  onDeleteClick(): void{

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe( result => {

      if (typeof(result) === 'boolean' && result){

        this.deleteCompany();
      }

    });
  }

  onAddFieldClick(): void{

    const compList = [];
    compList.push(this.company);
    const dialogRef = this.dialog.open(FieldDialogComponent, {
      height: '450px',
      width: '800px',
      data: {companyList: compList, mode: 'create', from: 'inside'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === null){
        return;
      }
      console.log(typeof(result));
      this.addField(result);
    });
  }


  async addField(result: object){

    const field = Field.create(result);
    this.companyService.addField(field).subscribe({
      next: x => {
        this.retrieveFields();
        this.snackBar.open('Campo aggiunto', 'OK', {
          duration: 5000
          });
      }
    });
  }


  async retrieveFields() {

    this.companyService.getFields(this.company.id).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'No results!!!'){
          this.fieldList = [];
          console.log('Nessun campo trovato');
        }
        else{
          console.log('Campi trovati');
          const list: Field[] = [];
          x.forEach( field => {
            const c = Field.create(field);
            list.push(c);
          });
          this.fieldList = list;
        }

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
      }
    });

  }

  async deleteCompany(){

    this.companyService.deleteCompany(this.company).subscribe({
      next: x => {
        this.snackBar.open('Struttura eliminata', 'OK', {
          duration: 5000
          });
        this.companyChanged.emit('deleted company');
      }
    });
  }


  async editCompany(result: object){

    const updatedCompany = Company.create(result);
    updatedCompany.id = this.company.id;
    updatedCompany.owner = this.company.owner;
    console.log(this.company.owner);
    this.companyService.updateCompany(updatedCompany).subscribe({
      next: x => {
        this.snackBar.open('Struttura modificata', 'OK', {
          duration: 5000
          });
        this.companyChanged.emit('updated company');
      }
    });
  }

}
