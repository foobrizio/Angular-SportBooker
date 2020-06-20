import { Component, OnInit, Input } from '@angular/core';
import { Reservation } from 'src/app/classes/reservation';

@Component({
  selector: 'app-compact-reservation',
  templateUrl: './compact-reservation.component.html',
  styleUrls: ['./compact-reservation.component.css']
})
export class CompactReservationComponent implements OnInit {

  @Input() reservation: Reservation;

  constructor() { }

  ngOnInit(): void {
  }

}
