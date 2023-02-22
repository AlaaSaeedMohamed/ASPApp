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



  getSearch(SearchString: string) {
    //this.vm.find( x => x.boooks.title === SearchString);
    //this.vm.find( x => x.users.username === SearchString);
    if(this.vm.length > 0){
      return of(this.vm);
    }

    //if(this.vm) return of(this.vm);

    return this.http.get<searchVM[]>(this.baseUrl + 'search/' + SearchString).pipe(
      map(results => {
        this.vm = results;
        return results;
      })
    );
  //, this.getHttpOptions()   // was used before using the jwt interceptor
  }

}