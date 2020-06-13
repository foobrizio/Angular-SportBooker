import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from 'src/app/classes/reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private mainUrl= 'http://localhost:8080'

  constructor(private http: HttpClient) { }


  getActiveReservationsForField(fieldId: number): Observable<Reservation[]>{

    return this.http.get<Reservation[]>(this.mainUrl + '/company/reservations/' + fieldId);
  }
}
