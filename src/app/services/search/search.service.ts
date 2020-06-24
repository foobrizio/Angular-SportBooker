import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Field } from 'src/app/classes/field';
import { Company } from 'src/app/classes/company';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  lookingFor: string;
  sport: string;
  rating: string;
  city: string;
  terrain: string;
  date: Date;
  time: string;

  private url = 'http://localhost:8080/search/';
  private finalUrl: string;
  private qtUrl: string;

  constructor(private http: HttpClient) { }

  setParams(params: Params): void {

    this.lookingFor = params.lookingFor;
    this.sport = params.sport;
    this.rating = params.rating;
    this.terrain = params.terrain;
    this.city = params.city;
    this.date = params.date;
    this.time = params.time;
  }

  search(): void{

    this.finalUrl = this.url.concat('');
    this.qtUrl = this.url.concat('qt/');
    let resto = '';
    if (this.lookingFor === 'fields'){
      resto = resto.concat('fields?');
      if (this.sport){
        resto = resto.concat('sport=', this.sport, '&');
      }
      if (this.city){
        resto = resto.concat('city=', this.city, '&');
      }
      if (this.terrain){
        resto = resto.concat('terrain=', this.terrain, '&');
      }
      if (this.rating){
        resto = resto.concat('rating=', this.rating, '&');
      }
      if (this.date){
        resto = resto.concat('date=', this.date.getTime().toString(), '&');
      }
      if (this.time){
        resto = resto.concat('time=', this.time, '&');
      }
    } else {
      resto = resto.concat('companies?');
      if (this.city){
        resto = resto.concat('city=', this.city, '&');
      }
      if (this.rating){
        resto = resto.concat('rating=', this.rating, '&');
      }
    }
    this.finalUrl = this.finalUrl + resto.substring(0 , resto.length - 1);
    this.qtUrl = this.qtUrl + resto.substring(0, resto.length - 1);
  }


  getFieldsQuantity(): Observable<number>{

    console.log(this.finalUrl);
    console.log(this.qtUrl);
    return this.http.get<number>(this.qtUrl);
  }

  getCompaniesQuantity(): Observable<number>{

    return this.http.get<number>(this.qtUrl);
  }

  getFields(pageNumber: number, pageSize: number): Observable<Field[]>{

    const paramz = new HttpParams().set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Field[]>(this.finalUrl, {params: paramz});
  }

  getCompanies(pageNumber: number, pageSize: number): Observable<Company[]>{

    const paramz = new HttpParams().set('pageNumber', String(pageNumber)).set('pageSize', String(pageSize));
    return this.http.get<Company[]>(this.finalUrl, {params: paramz});
  }




}
