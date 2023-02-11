import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { searchVM } from '../_models/users_booksVM';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl = environment.apiUrl
  vm: searchVM[] = [];
  constructor(private http: HttpClient) { }



  getSearch(result: string) {
    const book = this.vm.find( x => x.books.title === result);
    const user = this.vm.find( x => x.users.username === result);

    if(book) return of(book);
    if(user) return of(user);


    return this.http.get<searchVM[]>(this.baseUrl + 'search/' + result).pipe(
      map(results => {
        this.vm = results;
        return results;
      })
    );
  //, this.getHttpOptions()   // was used before using the jwt interceptor
  }

}