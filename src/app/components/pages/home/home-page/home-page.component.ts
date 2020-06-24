import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {


  isAuthenticated: boolean;
  constructor(public okta: OktaAuthService) { }

  ngOnInit(): void {

    this.checkAuthentication();
    // questa riga serve per inizializzare la nuova pagina dalla cima, altrimenti lo scroll rimane uguale alla pagina precedente
    window.scrollTo(0, 0);
  }

  async checkAuthentication(){

    this.isAuthenticated = await this.okta.isAuthenticated();
  }

}
