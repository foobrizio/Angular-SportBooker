import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from 'src/app/classes/company';
import { Observable } from 'rxjs';
import { Review } from 'src/app/classes/review';
import { Field } from 'src/app/classes/field';
import { Reservation } from 'src/app/classes/reservation';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  private mainUrl='http://localhost:8080/company/'

  constructor(private http: HttpClient) { }

  getCompany(id: number): Observable<Company>{

    return this.http.get<Company>(this.mainUrl + String(id));
  }

  getReviews(id: number): Observable<Review[]>{

    return this.http.get<Review[]>(this.mainUrl + 'reviews/' + String(id));
  }

  getFields(id: number): Observable<Field[]>{

    return this.http.get<Field[]>(this.mainUrl + 'fields/' + String(id));
  }

  getOldReservations(id: number): Observable<Reservation[]>{

    return this.http.get<Reservation[]>(this.mainUrl + 'reservations/raw/past/' + String(id));
  }
}
