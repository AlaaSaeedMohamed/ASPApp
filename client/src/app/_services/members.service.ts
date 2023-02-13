import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl
  members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers() {
    if (this.members.length > 0 ) return of(this.members) // of() to return an observable of this.members
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    ); //,this.getHttpOptions()  // was used before using the jwt interceptor
  }


  getMember(username: string) {
    const member = this.members.find( x => x.userName === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username); //, this.getHttpOptions()   // was used before using the jwt interceptor
  }


  updateMember(member: Member) 
  {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member); // this will tell us the index od the member in the members array
        this.members[index] = {...this.members[index], ...member} // takes all of the elements in the member of this location in the array a splits them
      })
    );
  }

  addLike(username: string)
  {
    return this.http.post(this.baseUrl + 'likes/'+ username, {});
  }

  getLikes(predicate: string)
  {
    return this.http.get<Member[]>(this.baseUrl + 'likes?predicate=' + predicate);
  }
  // was used before using the jwt interceptor
  //getHttpOptions() {
  //  const userString = localStorage.getItem('user');
  //  if (!userString) return;
  //  const user = JSON.parse(userString);
  //  return {
  //    headers: new HttpHeaders({
  //      Authorization: 'Bearer' + user.token
  //    })
  //  }
 // }
}
