import { Injectable } from '@angular/core';
import { User } from 'src/app/classes/user';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Reservation } from 'src/app/classes/reservation';
import { Observable } from 'rxjs';
import { Review } from 'src/app/classes/review';
import { Company } from 'src/app/classes/company';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private mainUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }


  retrieveUser( email: string): Observable<User>{


    const paramz = new HttpParams().set('email', email);
    return this.http.get<User>(this.mainUrl, {params: paramz});
  }

  registerUser( user: User): Observable<string>{

    const userStringato = JSON.stringify(user);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<string>(this.mainUrl + '/register', userStringato, config);
  }

  getActiveReservations( email: string): Observable<Reservation[]>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<Reservation[]>(this.mainUrl + '/myReservations/', {params: paramz});
  }

  getExpiredReservations( email: string): Observable<Reservation[]>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<Reservation[]>(this.mainUrl + '/history/reservations/', {params: paramz});
  }

  getReviews( email: string): Observable<Review[]>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<Review[]>(this.mainUrl + '/history/reviews/', {params: paramz});
  }

  getCompanies( email: string): Observable<Company[]>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<Company[]>(this.mainUrl + '/myCompanies/', {params: paramz});
  }

  deleteReservation(res: Reservation): Observable<string>{

    const paramz = new HttpParams().set('id', String(res.id));
    const options = {params: paramz};
    return this.http.delete<string>(this.mainUrl + '/myReservations', options);
  }
}
