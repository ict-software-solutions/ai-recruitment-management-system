import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LOGGED_IN_USER } from '../../util/constants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = JSON.parse(sessionStorage.getItem(LOGGED_IN_USER));
    if (user != null) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + user.token)
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
  
  
}
