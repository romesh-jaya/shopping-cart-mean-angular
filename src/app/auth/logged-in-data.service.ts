import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginUser } from './login-user.model';

@Injectable({ providedIn: 'root' })
export class LoggedInDataService {
    loggedInUser: LoginUser = null;
    loginChanged = new Subject();
}
