import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoggedInDataService } from '../auth/logged-in-data.service';
import { ErrorDialog } from '../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';



@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isLoginMode = true;
  isLoggedIn = false;
  alert: string;
  showSpinner = false;

  constructor(private authService: AuthService, private lIDService: LoggedInDataService, public dialog: MatDialog
    , private utilityService: UtilityService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.lIDService.loggedInUser;
    this.lIDService.loginChanged.subscribe(() => {
      this.isLoggedIn = !!this.lIDService.loggedInUser;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.showSpinner = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    // perform login
    authObs.subscribe(
      () => {
        if (this.isLoginMode) {
          console.log('Logged in. User: ' + email);
        } else {
          console.log('Logged in after Signup. User: ' + email);
        }

        this.showSpinner = false;
        this.isLoggedIn = true;
        form.reset();

        this.isLoginMode = true; // for next time around
      },
      error => {
        if (this.isLoginMode) {
          this.alert = 'Error while trying to login : ';
        } else {
          this.alert = 'Error while trying to sign up : ';
        }

        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: { message: this.alert + this.utilityService.getError(error) },
          panelClass: 'custom-modalbox'
        });
      }
    );

  }

}
