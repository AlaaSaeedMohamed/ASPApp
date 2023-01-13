import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})

// we dont need to subscribe because an auth gaurd automatically subscribes and unsubscribes from observables
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService){}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(

      map(user => {

        if(user) return true;

        else {

          this.toastr.error('you shall not pass!');
          return false;
        
        }
      })
    )
  }
  
}
