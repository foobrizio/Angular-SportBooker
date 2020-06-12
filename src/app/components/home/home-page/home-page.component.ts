import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {

    // questa riga serve per inizializzare la nuova pagina dalla cima, altrimenti lo scroll rimane uguale alla pagina precedente
    window.scrollTo(0, 0);
  }

}
