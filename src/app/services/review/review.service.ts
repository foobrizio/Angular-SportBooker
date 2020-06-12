import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  private url = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getRating( companyId: number): Observable<number>{

    const finalUrl = this.url + 'company/rating/' + String(companyId);
    return this.http.get<number>(finalUrl);
  }
}
