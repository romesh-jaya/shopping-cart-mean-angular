import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }
  loginProcessComplete = false; // this is to prevent showing the router outlet before the login process is completed


  ngOnInit() {

    this.authService.loginProcessComplete.subscribe(data => {
      this.loginProcessComplete = data;
      console.log('Login Process completed.');
    });
    this.authService.autoLogin();
  }
}
