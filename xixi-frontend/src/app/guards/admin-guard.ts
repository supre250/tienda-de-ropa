// ------------------------------------------------------
// Guard de autorización para ADMIN.
// Solo permite el acceso si el usuario logueado
// tiene rol ADMIN.
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }

    // Si no es admin, lo mandamos al home o a donde quieras
    return this.router.createUrlTree(['/'], {
      queryParams: { notAllowed: true, from: state.url },
    });
  }
}
