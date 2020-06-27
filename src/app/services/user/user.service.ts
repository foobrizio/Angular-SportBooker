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

  getActiveReservations( email: string, pageNumber: number, pageSize: number): Observable<Reservation[]>{

    const paramz = new HttpParams().set('email', email).set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Reservation[]>(this.mainUrl + '/myReservations/', {params: paramz});
  }

  getActiveReservationsQuantity( email: string): Observable<number>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<number>(this.mainUrl + '/myReservations/qt/', {params: paramz});

  }

  getExpiredReservations( email: string, pageNumber: number, pageSize: number): Observable<Reservation[]>{

    const paramz = new HttpParams().set('email', email).set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Reservation[]>(this.mainUrl + '/history/reservations/', {params: paramz});
  }

  getExpiredReservationsQuantity( email: string): Observable<number>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<number>(this.mainUrl + '/history/reservations/qt/', {params: paramz});
  }

  getReviews( email: string, pageNumber: number, pageSize: number): Observable<Review[]>{

    const paramz = new HttpParams().set('email', email).set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Review[]>(this.mainUrl + '/history/reviews/', {params: paramz});
  }

  getReviewsQuantity( email: string): Observable<number>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<number>(this.mainUrl + '/history/reviews/qt/', {params: paramz});

  }

  getAllCompanies( email: string): Observable<Company[]>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<Company[]>(this.mainUrl + '/myCompanies/all/', {params: paramz});
  }

  getCompanies( email: string, pageNumber: number, pageSize: number): Observable<Company[]>{

    const paramz = new HttpParams().set('email', email).set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Company[]>(this.mainUrl + '/myCompanies/', {params: paramz});
  }

  getCompaniesQuantity( email: string): Observable<number>{

    const paramz = new HttpParams().set('email', email);
    return this.http.get<number>(this.mainUrl + '/myCompanies/qt/', {params: paramz});
  }

  deleteReservation(res: Reservation): Observable<string>{

    const paramz = new HttpParams().set('id', String(res.id));
    const options = {params: paramz};
    return this.http.delete<string>(this.mainUrl + '/myReservations', options);
  }

  deleteUser(id: number): Observable<string>{

    const paramz = new HttpParams().set('id', String(id));
    return this.http.delete<string>(this.mainUrl, {params: paramz});

  }
}
