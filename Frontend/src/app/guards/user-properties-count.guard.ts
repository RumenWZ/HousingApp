import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class UserPropertiesCountGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      return this.userService.getUserPropertiesCount().pipe(
        map((propertiesCount: number) => {
          if (propertiesCount < 10) {
            return true;
          } else {
            this.alertify.error('You can not have more than 10 properties listed');
            return this.router.createUrlTree(['/']);
          }
        }), catchError(() => of(false)));
      }
    }



