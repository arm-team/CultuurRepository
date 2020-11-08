import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
      private authService: AuthenticationService,
      private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.authService.getUser();
        if (user) {
          resolve(true);
        } else {
          reject('No user logged in');
          await this.router.navigateByUrl('/signin');
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
