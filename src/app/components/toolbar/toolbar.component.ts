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
import { MatSnackBar } from '@angular/material/snack-bar';

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
              private userService: UserService, private compService: CompanyService, private snackBar: MatSnackBar) { }

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
        const message: any = x;
        if (message.message === 'User doesn\'t exist!!!'){ /* Ci stiamo connettendo al sito per la prima volta */
          this.user = newUser;
          this.registerUser(newUser);
        }
        else{
          console.log('Utente loggato');
          this.user = User.create(x);
          console.log(this.user);
          this.getCompanyList();
        }
      },
      error: err => {
        console.log('Observer ha generato l\'errore ');
        console.log(err);
      }
    });
  }

  async registerUser( user: User){

    this.userService.registerUser(user).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'User already exists!!!'){
          console.log('Impossibile registrarsi, in quanto l\' utente esiste già');
        }
        else{
          this.snackBar.open('Benvenuto', 'OK', {
            duration: 5000
            });
        }
      },
      error: err => {
        console.log('Impossibile registrare l\'utente');
        console.log(err);
      }
    });

  } // registerUser


  async getCompanyList(){

    this.userService.getAllCompanies(this.user.email).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'User doesn\'t exist!!!'){
          console.log('L\'utente non esiste???');
        }
        else if (message.message === 'No results!!!'){
          this.companyList = [];
          console.log('Nessuna struttura trovata');
        }
        else{
          const list: Company[] = [];
          x.forEach( company => {
            const c = Company.create(company);
            list.push(c);
          });
          this.companyList = list;
        }
      },
      error: err => {
        console.log(err);
      }
    });
  } // getCompanyList


  openCompanyDialog(): void{

    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      height: '450px',
      width: '1000px',
      data: {mode: 'create'}
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
      data: { companyList: this.companyList, mode: 'create', from: 'outside'}
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
        const message: any = x;
        if (message === 'User doesn\'t exist!!!'){
          console.log('L\'utente non esiste???');
        }
        else{
          const compy = Company.create(x);
          this.companyList.push(compy);
          this.snackBar.open('Struttura create con successo', 'OK', {
            duration: 5000
          });
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  async addField(result: object){

    const field = Field.create(result);
    this.compService.addField(field).subscribe({
      next: x => {
        const message: any = x;
        if (message.message === 'Company doesn\'t exist!!!'){
          console.log('La struttura non esiste');
        }
        else{
          this.snackBar.open('Campo inserito correttamente', 'OK', {
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
