import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { Property } from 'src/app/model/property';
import { HousingService } from 'src/app/services/housing.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailResolverService implements Resolve<Property> {

  constructor(
    private housingService: HousingService,
    private router: Router
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Property> | Property {
    const propId = route.params['id'];
    return this.housingService.getProperty(+propId).pipe(
      catchError((error : any)=> {
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }
}
