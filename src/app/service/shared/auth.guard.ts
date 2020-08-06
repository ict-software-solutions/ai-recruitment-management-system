import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(public auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated()) {
      // not logged in so redirect to login page with the return url and return false
      // this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url }});
      this.router.navigate(['']);
      window.sessionStorage.clear();
      return false;
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated()) {
      // this.router.navigate(['/sessions/signin'], { queryParams: { returnUrl: state.url }});
      this.router.navigate(['']);
      window.sessionStorage.clear();
      return false;
    }
    return true;
  }
}
