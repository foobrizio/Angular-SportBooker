import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reservation } from 'src/app/classes/reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private mainUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  getActiveReservationsForField(fieldId: number): Observable<Reservation[]>{

    return this.http.get<Reservation[]>(this.mainUrl + '/company/reservations/' + fieldId);
  }

  addReservation(res: Reservation): Observable<Reservation>{

    const resStringata = JSON.stringify(res);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<Reservation>(this.mainUrl + '/company/book', resStringata, config);
  }
}
