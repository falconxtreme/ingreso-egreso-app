import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombreUsuario: string = '';
  userSubscription: Subscription;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userSubscription = this._store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.nombreUsuario = user.nombre;
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public logout() {
    Swal.fire('Espere por favor...', '', 'info');
    Swal.showLoading();
    this._authService
      .logout()
      .then((resp) => {
        Swal.close();
        this._router.navigate(['/login']);
      })
      .catch((err) => {
        Swal.fire('Oops', err.message, 'error');
        console.error(err);
      });
  }
}
