import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}
  // observe all the http event and handle the error
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      delay(1000),
      catchError((error) => {
        if (error) {
          // check status 400
          if (error.status === 400) {
            // if error object has error list, which means it is validation error
            if (error.error.errors) {
              // pass the error object back to component
              throw error.error;
            } else {
              this.toastr.error(error.error.message, error.error.statusCode);
            }
          }
          if (error.status === 401) {
            this.toastr.error(error.error.message, error.error.statusCode);
          }
          if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          }
          if (error.status === 500) {
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }
        return throwError(error);
      })
    );
  }
}
