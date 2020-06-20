import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/classes/user';
import { CompanyDialogComponent } from '../dialog/company-dialog/company-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FieldDialogComponent } from '../dialog/field-dialog/field-dialog.component';
import { Company } from 'src/app/classes/company';
import { CompanyService } from 'src/app/services/company/company.service';
import { Field } from 'src/app/classes/field';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  isAuthenticated: boolean;
  user: User;
  companyList: Company[];

  constructor(public dialog: MatDialog, public oktaAuth: OktaAuthService,
              private userService: UserService, private compService: CompanyService) { }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // Subscribe to authentication state change
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
    if (this.isAuthenticated){
      this.getUser();
    }
  }

  login(): void{

    this.oktaAuth.loginRedirect();

  }

  logout(): void{
    this.oktaAuth.logout();
  }

  async getUser() {

    const  newUser = new User();
    newUser.firstName = (await this.oktaAuth.getUser()).given_name;
    newUser.lastName = (await this.oktaAuth.getUser()).family_name;
    newUser.email = (await this.oktaAuth.getUser()).preferred_username;
    this.userService.retrieveUser(newUser.email).subscribe({
      next: x => {
        console.log('Utente loggato');
        console.log(x);
        this.user = x;
        this.getCompanyList();
      },
      error: err => {
        if (err.error === 'User doesn\'t exist!!!'){
          console.log('L\'utente sta accedendo per la prima volta');
          this.user = newUser;
          this.registerUser(newUser);
        }
        else{
          console.log('Observer ha generato l\'errore ');
          console.log(err);
        }
      },
      complete: () => { console.log('Completed'); }
    });
  }

  async registerUser( user: User){

    this.userService.registerUser(user).subscribe({
      next: x => {
        console.log(x);
      },
      error: err => {
        if (err.error === 'User already exists!!!'){
          console.log('Impossibile registrare. L\' utente esiste già');
        }
        else{
          console.log('Impossibile registrare l\'utente');
          console.log(err);
        }
      },
      complete: () => {
        console.log('Completato');
      }
    });

  } // registerUser


  async getCompanyList(){

    this.userService.getCompanies(this.user.email).subscribe({
      next: x => {
        const list: Company[] = [];
        x.forEach( company => {
          const c = Company.create(company);
          list.push(c);
        });
        this.companyList = list;
      },
      error: err => {
        if (err.error === 'User doesn\'t exists!!!'){
          console.log('L\'utente non esiste???');
        }
        else if (err.error === 'No results!!!'){
          this.companyList = [];
          console.log('Nessuna struttura trovata');
          console.log(err);
        }
      },
      complete: () => {
        console.log('Completato');
      }

    });
  } // getCompanyList


  openCompanyDialog(): void{

    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      height: '450px',
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === null){
        return;
      }
      this.addCompany(result);
    });
  }


  openFieldDialog(): void{

    const dialogRef = this.dialog.open(FieldDialogComponent, {
      height: '450px',
      width: '800px',
      data: this.companyList
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === null){
        return;
      }
      console.log(typeof(result));
      this.addField(result);
    });
  }

  async addCompany(result: object){
    const comp = Company.create(result);
    comp.owner = this.user.id;
    console.log(comp);
    this.compService.addCompany(comp).subscribe({
      next: x => {
        console.log('Riceviamo qualcosa');
        const compy = Company.create(x);
        this.companyList.push(compy);
      },
      error: err => {
        console.log(err);
      },
      complete: () => { console.log('Company added'); }
    });
  }

  async addField(result: object){

    const field = Field.create(result);
    console.log('Vogliamo aggiungere un campo');
    this.compService.addField(field).subscribe({
      next: x => {
        console.log('Campo inserito correttamente');
      },
      error: err => {
        console.log(err);
      },
      complete: () => { console.log('Company added'); }

    });
  }



}
