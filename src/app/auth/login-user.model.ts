import { environment } from '../../environments/environment';

export class LoginUser {
    constructor(
        public email: string,
        public token: string,
        private _isAdmin: boolean,
        public refreshToken: string
    ) { }

    get isAdmin() {
        return this._isAdmin;
    }

    get isSuperUser() {
        if (this.email == environment.superUser) {
            return true;
        }
        return false;
    }
}
