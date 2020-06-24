import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Company } from 'src/app/classes/company';
import { Observable } from 'rxjs';
import { Review } from 'src/app/classes/review';
import { Field } from 'src/app/classes/field';
import { Reservation } from 'src/app/classes/reservation';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  private mainUrl = 'http://localhost:8080/company';

  constructor(private http: HttpClient) { }


  /* Chiamate GET */
  getCompany(id: number): Observable<Company>{

    return this.http.get<Company>(this.mainUrl + '/' + String(id));
  }

  getReviews(id: number, pageNumber: number, pageSize: number, order: string): Observable<Review[]>{

    let sortBy: string;
    if (order === 'recent'){
      sortBy = 'publishTime';
    }
    else{ sortBy = 'vote'; }
    const paramz = new HttpParams().set('sortBy', sortBy).set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Review[]>(this.mainUrl + '/reviews/' + String(id), {params: paramz});
  }

  getFields(id: number, pageNumber: number, pageSize: number): Observable<Field[]>{

    const paramz = new HttpParams().set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Field[]>(this.mainUrl + '/fields/' + String(id), {params: paramz});
  }

  getFieldQuantity(id: number): Observable<number>{

    return this.http.get<number>(this.mainUrl + '/fields/qt/' + String(id));

  }

  getOldReservations(id: number): Observable<Reservation[]>{

    return this.http.get<Reservation[]>(this.mainUrl + '/reservations/raw/past/' + String(id));
  }




  /* Chiamate POST */
  addCompany(comp: Company): Observable<Company>{

    const compStringata = JSON.stringify(comp);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<Company>(this.mainUrl, compStringata, config);
  }

  addField(field: Field): Observable<Field>{

    const fieldStringato = JSON.stringify(field);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<Field>(this.mainUrl + '/fields', fieldStringato, config);
  }


  /* Chiamate PUT */
  updateCompany(comp: Company): Observable<Company>{

    const compStringata = JSON.stringify(comp);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.put<Company>(this.mainUrl, compStringata, config);
  }

  updateField(field: Field): Observable<Field>{

    const fieldStringato = JSON.stringify(field);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.put<Field>(this.mainUrl + '/fields', fieldStringato, config);

  }


  /* Chiamate DELETE */
  deleteCompany(comp: Company): Observable<string>{

    const paramz = new HttpParams().set('id', String(comp.id));
    const options = {params: paramz};
    return this.http.delete<string>(this.mainUrl, options);

  }

  deleteField(field: Field): Observable<string>{

    const paramz = new HttpParams().set('id', String(field.id));
    const options = {params: paramz};
    return this.http.delete<string>(this.mainUrl + '/fields', options);

  }
}
