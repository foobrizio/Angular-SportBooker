import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/classes/user';
import { CompanyDialogComponent } from '../dialog/company-dialog/company-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FieldDialogComponent } from '../dialog/field-dialog/field-dialog.component';
import { Company } from 'src/app/classes/company';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  isAuthenticated: boolean;
  user: User;
  companyList: Company[];

  constructor(public dialog: MatDialog, public oktaAuth: OktaAuthService, private userService: UserService) { }

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
        this.companyList = x;
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
  }

  openFieldDialog(): void{

    const dialogRef = this.dialog.open(FieldDialogComponent, {
      height: '400px',
      width: '800px'
    });

  }



}
