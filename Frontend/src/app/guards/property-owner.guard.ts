import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';
import { HousingService } from '../services/housing.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyOwnerGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private housingService: HousingService,
    private router: Router
  ) {}

  // Prevent the user from modifying other users properties

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      const propertyId = Number(route.paramMap.get('id'));
      return this.housingService.getPropertyDetails(propertyId).pipe(
        switchMap((propertyDetails: any) => {
          const propertyOwnerID = propertyDetails.postedBy;

          return this.userService.getLoggedInUser().pipe(
            switchMap((loggedInUser: any) => {
              if (propertyOwnerID === loggedInUser.id) {
                return of(true);
              } else {
                return this.router.navigate(['/']);
              }
            }),
          );
        }),
      );
    }
  }


