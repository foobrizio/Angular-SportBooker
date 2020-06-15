import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  isAuthenticated: boolean;
  name: string;
  email: string;

  constructor(public oktaAuth: OktaAuthService) { }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // Subscribe to authentication state change
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
    if (this.isAuthenticated){
      this.name = (await this.oktaAuth.getUser()).given_name;
      console.log((await this.oktaAuth.getUser()).preferred_username);
    }
  }

  login(): void{

    this.oktaAuth.loginRedirect();

  }

  logout(): void{
    this.oktaAuth.logout();
  }



}
