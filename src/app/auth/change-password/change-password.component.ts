import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ErrorDialog } from '../../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  showSpinner = false;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const old_password = form.value.old_password;
    const password = form.value.password;

    this.showSpinner = true;

    this.authService.changePassword(old_password, password).subscribe(
      resData => {
        this.showSpinner = false;
        alert("password changed successfully!");
        form.reset();
        this.router.navigate(['/']);
      },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: {
            message: "Error while trying to change password : "
              + this.utilityService.getError(error)
          }, panelClass: 'custom-modalbox'

        });
      }

    );

  }

}
