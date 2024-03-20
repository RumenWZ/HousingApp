import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserForLogin } from 'src/app/model/user';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  constructor(
    private auth: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private sidenav: SidenavService
    ){ }


  onLogin(form: NgForm) {
    this.auth.authUser(form.value).subscribe(
      (response: any) => {
        const user = response;
        localStorage.setItem('token', user.token);
        localStorage.setItem('userName', user.userName);
        this.router.navigate(['/']);
        this.alertify.success("Login Successful");
        this.sidenav.updateSidenav();
      }
    );
  }
}
