import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenseService } from './presense.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);  // to give the observable an initial value of null, we but the obs to null because we dont know if we have the info in local storage or not until we check(until we know for sure we have a user), ((User | null)) is because blue null is giving an error
  currentUser$ = this.currentUserSource.asObservable(); // $ sign to indicate its an observable 
  constructor(private http: HttpClient, private router: Router, private presenceService: PresenseService) { }

  login(model: any)
  {
    
      // Async pipe Automatically subscribes/unsubscribes from the Observable
    
    return this.http.post<User>(this.baseUrl + 'account/login' , model).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
          

          this.setCurrentUser(user);
          
        }
      })
    )
  }


  register(model: any){

    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user){

          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;

    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }


  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('results');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string)
  {
    return JSON.parse(atob(token.split('.')[1])); // to get the middle part of the token which contains the roles
  }
}
