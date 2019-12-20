import { LoginUser } from './login-user.model';
import { Subject } from 'rxjs';

export class LoggedInDataService {
    loggedInUser: LoginUser = null;
    loginChanged = new Subject();
}
