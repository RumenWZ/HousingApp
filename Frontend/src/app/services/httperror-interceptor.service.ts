import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, concatMap, of, retryWhen, throwError } from "rxjs";
import { AlertifyService } from "./alertify.service";
import { ErrorCode } from '../enums/enums';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private userService: UserService
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(error => this.retryRequest(error, 10)),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.setError(error);

        if (error.status === ErrorCode.unauthorized) {
          this.userService.logout();
          this.router.navigate(['/user/login']);
          this.alertify.error('Login session expired');
        }
        this.alertify.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  retryRequest(error: any, retryCount: number) : Observable<unknown>
  {
    return error.pipe(
      concatMap((checkErr: HttpErrorResponse, count: number) => {
          if (count <= retryCount) {
            switch(checkErr.status) {
              case ErrorCode.serverDown: return of(checkErr);
              case ErrorCode.unauthorized: return of(checkErr);

            }
          }
          return throwError(checkErr);
        })
    )
  }

  setError(error: HttpErrorResponse): string {
    let errorMessage = 'Unknown error occured';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    }
    else {
      if (error.status !== 0) {
        errorMessage = error.error;
      }
    }
    return errorMessage;
  }
}
