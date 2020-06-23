import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/classes/user';
import { Company } from 'src/app/classes/company';
import { Review } from 'src/app/classes/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  private url = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }


  addReview(review: Review): Observable<Review>{

    const finalUrl = this.url + 'company/review';
    const reviewStringata = JSON.stringify(review);
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<Review>(finalUrl, reviewStringata, config);
  }

  getRating( companyId: number): Observable<number>{

    const finalUrl = this.url + 'company/rating/' + String(companyId);
    return this.http.get<number>(finalUrl);
  }

  existsByUserAndCompany( user: User, company: Company): Observable<string>{

    const paramz = new HttpParams()
                         .set('user', String(user.id))
                         .set('company', String(company.id));
    const finalUrl = this.url + 'company/review';
    return this.http.get<string>(finalUrl, {params: paramz});
  }
}
