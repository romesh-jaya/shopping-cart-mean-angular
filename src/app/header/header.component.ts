import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoggedInDataService } from '../auth/logged-in-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  isSuperUser = false;
  loggedInUser;
  constructor(private authService: AuthService, private lIDService: LoggedInDataService, private router: Router) { }

  ngOnInit() {
    this.refreshInfo();
    this.lIDService.loginChanged.subscribe(() => {
      this.refreshInfo();
    }
    );
  }

  refreshInfo() {
    this.isAuthenticated = !!this.lIDService.loggedInUser;
    if (this.lIDService.loggedInUser) {
      this.loggedInUser = this.lIDService.loggedInUser.email;
      this.isAdmin = this.lIDService.loggedInUser.isAdmin;
      this.isSuperUser = this.lIDService.loggedInUser.isSuperUser;
    } else {
      this.isAdmin = false;
      this.isSuperUser = false;
    }
  }

  onLogout() {
    this.authService.logout();
  }

  onChangePassword() {
    this.router.navigate(['/change-password']);
  }

}
