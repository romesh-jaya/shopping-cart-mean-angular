import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { LoginUser } from './login-user.model';
import { LoggedInDataService } from './logged-in-data.service';
import { UtilityService } from '../shared/utility.service';
import { environment } from 'src/environments/environment';


export interface AuthResponseData {
    token: string;
    isAdmin: boolean;
    refreshToken: string;
}

export class AuthService {
    constructor(private http: HttpClient, private router: Router,
        private cookieService: CookieService,
        private lIDService: LoggedInDataService, private utilityService: UtilityService) { }

    baseURL = environment.nodeEndPoint + "/users";

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/login',
                {
                    email: email,
                    password: password,
                }
            )
            .pipe(
                tap(resData => {
                    this.handleAuthentication(true, email, resData.token, resData.isAdmin, resData.refreshToken);
                })
            );
    }


    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/signup',
                {
                    email: email,
                    password: password
                }
            )
            .pipe(
                tap(resData => {
                    this.handleAuthentication(true, email, resData.token, resData.isAdmin, resData.refreshToken);
                })
            );
    }


    changePassword(old_password: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/change-password',
                {
                    old_password: old_password,
                    password: password,
                }
            )
            .pipe(
                tap(resData => {
                    this.handleAuthentication(true, this.lIDService.loggedInUser.email, resData.token, resData.isAdmin,
                        resData.refreshToken);
                })
            );
    }


    refreshToken(saveCookie: boolean, email?: string, refreshToken?: string) {
        if (!email) {
            email = this.lIDService.loggedInUser.email;
        }

        if (!refreshToken) {
            refreshToken = this.lIDService.loggedInUser.refreshToken;
        }


        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/refresh-token',
                {
                    email: email,
                    refreshToken: refreshToken
                }
            )
            .pipe(
                tap(resData => {
                    console.log("Obtained fresh token.");
                    this.handleAuthentication(saveCookie, email, resData.token, resData.isAdmin,
                        refreshToken);
                })
            );
    }

    refreshTokenInternal(saveCookie: boolean, email: string, refreshToken: string) {

        this.http
            .post<AuthResponseData>(
                this.baseURL + '/refresh-token',
                {
                    email: email,
                    refreshToken: refreshToken
                }
            )
            .toPromise().then(resData => {
                console.log("Autologin using cookie.");
                console.log("Obtained fresh token.");
                this.handleAuthentication(saveCookie, email, resData.token, resData.isAdmin,
                    refreshToken);
            })
            .catch(error => {
                console.log("Autologin using refresh token failed. Back to login screen : " + this.utilityService.getError(error));
                this.router.navigate(['/']);
            });
    }

    private handleAuthentication(
        saveCookie: boolean,
        email: string,
        token: string,
        isAdmin: boolean,
        refreshToken: string
    ) {
        let user;

        user = new LoginUser(email, token, isAdmin, refreshToken);
        this.lIDService.loggedInUser = user;
        this.lIDService.loginChanged.next();
        if (saveCookie) {
            //creating a secure cookie.
            this.cookieService.set('AuthUser', JSON.stringify(this.lIDService.loggedInUser), undefined, '/', undefined, undefined, "Strict");
            console.log("Saving cookie for future use");
            if (isAdmin) {
                console.log("This user has admin privileges.");
            }
        }
    }



    autoLogin() {
        var storedCookie;
        storedCookie = this.cookieService.get('AuthUser');
        console.log("Reading cookie.");
        if (storedCookie) {

            const userData: {
                email: string;
                token: string;
                _isAdmin: boolean;
                refreshToken: string
            } = JSON.parse(storedCookie);

            if (!userData) {
                return;
            }
            console.log("Cookie contained user: " + userData.email + ", isAdmin: " + userData._isAdmin);

            //get a fresh token - mostly to check that server connection is still up
            this.refreshTokenInternal(false, userData.email, userData.refreshToken);
        }
        else {
            console.log("Cookie doesn't exist.");
        }
    }

    logout() {
        this.lIDService.loggedInUser = null;
        this.lIDService.loginChanged.next();
        this.router.navigate(['/']);
        this.cookieService.delete('AuthUser', '/');
        console.log('Deleting cookie');
    }

}