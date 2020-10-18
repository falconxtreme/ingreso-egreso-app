import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): Observable<boolean> {
    return this._authService.isAuth().pipe(
      tap((estado) => {
        if (!estado) this._router.navigate(['/login']);
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this._authService.isAuth().pipe(
      tap((estado) => {
        if (!estado) this._router.navigate(['/login']);
      }),
      take(1)
    );
  }
}
