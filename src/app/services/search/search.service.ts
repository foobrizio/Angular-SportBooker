import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { FieldComponent } from 'src/app/components/search/list/field/field.component';
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
    if (this.lookingFor === 'fields'){
      this.finalUrl = this.finalUrl.concat('fields?');
      if (this.sport){
        this.finalUrl = this.finalUrl.concat('sport=', this.sport, '&');
      }
      if (this.city){
        this.finalUrl = this.finalUrl.concat('city=', this.city, '&');
      }
      if (this.terrain){
        this.finalUrl = this.finalUrl.concat('terrain=', this.terrain, '&');
      }
      if (this.rating){
        this.finalUrl = this.finalUrl.concat('rating=', this.rating, '&');
      }
      if (this.date){
        this.finalUrl = this.finalUrl.concat('date=', this.date.getTime().toString(), '&');
      }
      if (this.time){
        this.finalUrl = this.finalUrl.concat('time=', this.time, '&');
      }
    } else {
      this.finalUrl = this.finalUrl.concat('companies?');
      if (this.city){
        this.finalUrl = this.finalUrl.concat('city=', this.city, '&');
      }
      if (this.rating){
        this.finalUrl = this.finalUrl.concat('rating=', this.rating, '&');
      }
    }
    this.finalUrl = this.finalUrl.substring(0 , this.finalUrl.length - 1);
  }



  getFields(): Observable<Field[]>{

    return this.http.get<Field[]>(this.finalUrl);

  }

  getCompanies(): Observable<Company[]>{

    return this.http.get<Company[]>(this.finalUrl);

  }




}
