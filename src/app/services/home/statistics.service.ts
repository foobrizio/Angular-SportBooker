import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type' : 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private url = 'http://localhost:8080/stats/';

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<number> {

    return this.http.get<number>(this.url + 'user');
  }

  getCompanyCount(): Observable<number> {

    return this.http.get<number>(this.url + 'company');
  }

  getReviewCount(): Observable<number> {

    return this.http.get<number>(this.url + 'review');
  }

  getReservationCount(): Observable<number> {

    return this.http.get<number>(this.url + 'reservation');
  }
}
