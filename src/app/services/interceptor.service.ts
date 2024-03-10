import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.auth.isLoggedIn) {
      let token = this.auth.getAuthToken();
      if (token != null) {
        const tokenReq = req.clone({
          setHeaders: { Authorization: `Basic ${token}` }
        });
        return next.handle(tokenReq);
      }
    }
    return undefined; //TODO: fix

  }
}