import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
    loginProcessComplete = new Subject<boolean>();
    baseURL = environment.nodeEndPoint + '/users';

    constructor(private http: HttpClient, private router: Router,
        private cookieService: CookieService,
        private lIDService: LoggedInDataService, private utilityService: UtilityService) {

    }


    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/login',
                {
                    email,
                    password,
                }
            )
            .pipe(
                tap(resData => {
                    this.handleAuthentication(email, resData.token, resData.isAdmin, resData.refreshToken);
                })
            );
    }


    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/signup',
                {
                    email,
                    password
                }
            )
            .pipe(
                tap(resData => {
                    this.handleAuthentication(email, resData.token, resData.isAdmin, resData.refreshToken);
                })
            );
    }


    changePassword(oldPassword: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                this.baseURL + '/change-password',
                {
                    oldPassword: oldPassword,
                    password,
                }
            )
            .pipe(
                tap(resData => {
                    this.handleAuthentication(this.lIDService.loggedInUser.email, resData.token, resData.isAdmin,
                        resData.refreshToken);
                })
            );
    }


    refreshToken(email?: string, refreshToken?: string) {
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
                    email,
                    refreshToken
                }
            )
            .pipe(
                tap(resData => {
                    console.log('Obtained fresh token.');
                    this.handleAuthentication(email, resData.token, resData.isAdmin,
                        refreshToken);
                })
            );
    }

    refreshTokenOnAutoLogin(email: string, refreshToken: string) {

        this.http
            .post<AuthResponseData>(
                this.baseURL + '/refresh-token',
                {
                    email,
                    refreshToken
                }
            )
            .toPromise().then(resData => {
                console.log('Autologin using cookie.');
                console.log('Obtained fresh token.');
                this.handleAuthentication(email, resData.token, resData.isAdmin,
                    refreshToken);
            })
            .catch(error => {
                console.log('Autologin using refresh token failed: ' + this.utilityService.getError(error));
            });
    }

    private handleAuthentication(
        email: string,
        token: string,
        isAdmin: boolean,
        refreshToken: string
    ) {
        const user = new LoginUser(email, token, isAdmin, refreshToken);
        this.lIDService.loggedInUser = user;
        this.lIDService.loginChanged.next();
        // creating a secure cookie.
        const saveData = { ...this.lIDService.loggedInUser, lastLoggedIn: new Date().getTime() };
        this.cookieService.set('AuthUser', JSON.stringify(saveData), 365, '/', undefined, undefined, 'Strict'); // set expiry for 1 year
        console.log('Saving cookie for future use');
        if (isAdmin) {
            console.log('This user has admin privileges.');
        }
        this.loginProcessComplete.next(true);
    }



    autoLogin() {
        let timeLapsed;
        const currentDate = new Date();
        const storedCookie = this.cookieService.get('AuthUser');
        console.log('Reading cookie.');
        if (storedCookie) {

            const userData: {
                email: string;
                token: string;
                _isAdmin: boolean;
                refreshToken: string;
                lastLoggedIn: number;
            } = JSON.parse(storedCookie);

            if (!userData) {
                return;
            }
            console.log('Cookie contained user: ' + userData.email + ', isAdmin: ' + userData._isAdmin);
            timeLapsed = currentDate.getTime() - new Date(userData.lastLoggedIn).getTime();
            if (timeLapsed / (1000 * 60) > 60) {// if the last login was greater than 60 mins
                // get a fresh token - mostly to check that server connection is still up
                this.refreshTokenOnAutoLogin(userData.email, userData.refreshToken);
            } else {
                console.log('Autologin without refresh token');
                const user = new LoginUser(userData.email, userData.token, userData._isAdmin, userData.refreshToken);
                this.lIDService.loggedInUser = user;
                this.lIDService.loginChanged.next();
            }
        } else {
            console.log('Cookie doesn\'t exist.');
        }
        this.loginProcessComplete.next(true);
    }

    logout() {
        this.lIDService.loggedInUser = null;
        this.lIDService.loginChanged.next();
        this.router.navigate(['/']);
        this.cookieService.delete('AuthUser', '/');
        console.log('Deleting cookie');
    }

}
