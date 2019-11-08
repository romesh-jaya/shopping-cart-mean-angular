import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoggedInDataService } from './logged-in-data.service';

@Injectable({ providedIn: 'root' })
export class SuperUserGuard implements CanActivate {
  constructor(private lIDService: LoggedInDataService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.lIDService.loggedInUser;

    if (!user) {
      return this.router.navigate(['/']);
    }

    if (user.isSuperUser) {
      return true;
    }

    return this.router.navigate(['/no-access']);
  }

}
