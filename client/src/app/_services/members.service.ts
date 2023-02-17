import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/user';
import { userParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl
  members: Member[] = [];
  memberCache = new Map(); // to set and get key values // to save the keys and not have to make a req to api every time
  userParams: userParams | undefined;
  user: User | undefined;
  
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new userParams(user);
          this.user = user;
        }
      }
    })
   }

   getUserParams() {
    return this.userParams;
   }

   setUserParams(params: userParams) {
    this.userParams = params;
   }

   resetUserParams(){
    if (this.user) {
      this.userParams = new userParams(this.user);
      return this.userParams
    }
    return;
   }

  getMembers(userParams : userParams) {
    const response =this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);
    let params = this.getPaginatioonHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);



    //if (this.members.length > 0 ) return of(this.members) // of() to return an observable of this.members
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response =>{
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    ); //,this.getHttpOptions()  // was used before using the jwt interceptor
  }

  
  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginationResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginationResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginationResult.pagination = JSON.parse(pagination);
        }
        return paginationResult;
      })
    );
  }

  private getPaginatioonHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    
    return params;
  }


  getMember(username: string) {
    //const member = this.members.find( x => x.userName === username);
    //if(member) return of(member);
    const member = [...this.memberCache.values()]
    .reduce((arr, elements) => arr.concat(elements.result), [])
    .find((member: Member) => member.userName === username);

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

  getLikes(predicate: string, pageNumber: number, pageSize: number)
  {
    //return this.http.get<Member[]>(this.baseUrl + 'likes?predicate=' + predicate);
    let params = this.getPaginatioonHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'likes', params);
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


