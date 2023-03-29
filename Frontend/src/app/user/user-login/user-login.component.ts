import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  constructor(
    private auth: AuthService,
    private alertify: AlertifyService,
    private router: Router
    ){ }


  onLogin(form: NgForm) {
    const token = this.auth.authUser(form.value);
    if (token) {
      localStorage.setItem('token', token.userName);
      this.router.navigate(['/']);
      this.alertify.success("Login Successful");
    } else {
      this.alertify.error("Invalid Credentials");
    }
  }
}
