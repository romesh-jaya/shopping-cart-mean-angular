import { Component } from '@angular/core';
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
export class ChangePasswordComponent {
  showSpinner = false;

  constructor(private authService: AuthService, private router: Router,
    public dialog: MatDialog, private utilityService: UtilityService) { }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const oldPassword = form.value.old_password;
    const password = form.value.password;

    this.showSpinner = true;

    this.authService.changePassword(oldPassword, password).subscribe(
      () => {
        this.showSpinner = false;
        alert('password changed successfully!');
        form.reset();
        this.router.navigate(['/']);
      },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: {
            message: 'Error while trying to change password : '
              + this.utilityService.getError(error)
          }, panelClass: 'custom-modalbox'

        });
      }

    );

  }

}
