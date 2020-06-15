import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/home/statistics.service';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  users = 0;
  reviews = 0;
  companies = 0;
  reservations = 0;

  constructor(private statService: StatisticsService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {

    this.getUserCount();
    this.getCompanyCount();
    this.getReservationCount();
    this.getReviewCount();

  }// getData



  getUserCount(): void {
    // otteniamo il numero di utenti
    this.statService.getUserCount().subscribe({
      next: x => {
        this.users = x;
        console.log('Observer ha ottenuto il valore ' + x );
      },
      error: err => console.log('Observer ha generato l\'errore ' + err),
      complete: () => console.log('Observer è stato completato')
    });
  } // getUserCount



  getReviewCount(): void {
    // otteniamo il numero di reviews
    this.statService.getReviewCount().subscribe({
      next: x => {
        this.reviews = x;
        console.log('Observer ha ottenuto il valore ' + x );
      },
      error: err => console.log('Observer ha generato l\'errore ' + err),
      complete: () => console.log('Observer è stato completato')
    });
  } // getReviewCount



  getReservationCount(): void {
    // otteniamo il numero di prenotazioni
    this.statService.getReservationCount().subscribe({
      next: x => {
        this.reservations = x;
        console.log('Observer ha ottenuto il valore ' + x );
      },
      error: err => console.log('Observer ha generato l\'errore ' + err),
      complete: () => console.log('Observer è stato completato')
    });
  } // getReservationCount



  getCompanyCount(): void {
     // otteniamo il numero di strutture
     this.statService.getCompanyCount().subscribe({
      next: x => {
        this.companies = x;
        console.log('Observer ha ottenuto il valore ' + x );
      },
      error: err => console.log('Observer ha generato l\'errore ' + err),
      complete: () => console.log('Observer è stato completato')
    });
  } // getCompanyCount

}
