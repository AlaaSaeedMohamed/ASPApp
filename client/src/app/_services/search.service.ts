import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { searchVM } from '../_models/users_booksVM';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl = environment.apiUrl
  vm: searchVM | undefined;
  memberCache = new Map();
  constructor(private http: HttpClient) { }



  getSearch(SearchString: string) {

    return this.http.get<searchVM>(this.baseUrl + 'search/' + SearchString).pipe(
      map(results => {
        this.vm = results
        return this.vm;
      })
    );
  //, this.getHttpOptions()   // was used before using the jwt interceptor
  }

}