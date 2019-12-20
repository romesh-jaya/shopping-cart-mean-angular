import {
  CanActivate, Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedInDataService } from './logged-in-data.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private lIDService: LoggedInDataService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = !!this.lIDService.loggedInUser;
    if (isAuth) {
      return true;
    }

    return this.router.navigate(['/']);
  }

}
