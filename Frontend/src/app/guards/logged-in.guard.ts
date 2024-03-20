import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, map } from 'rxjs';
import { AlertifyService } from '../services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  canActivate(): Observable<boolean> {
    return this.userService.checkIfLoggedIn().pipe(
      map((response: any) => {
        if (response == 200) {
          return true;
        } else {
          this.router.navigate(['/user/login']);
          this.alertify.warning('Please log in to access that page');
          return false;
        }
      })
    );
  }
}

