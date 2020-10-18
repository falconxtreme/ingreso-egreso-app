import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private _FormBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _store: Store<AppState>
  ) {}

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginForm = this._FormBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this._store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  public login() {
    if (this.loginForm.invalid) return;

    this._store.dispatch(uiActions.isLoading());

    // Swal.fire('Espere por favor...', '', 'info');
    // Swal.showLoading();
    const { correo, password } = this.loginForm.value;
    this._authService
      .login(correo, password)
      .then((credenciales) => {
        // Swal.close();
        this._store.dispatch(uiActions.stopLoading());
        this._router.navigate(['/']);
      })
      .catch((err) => {
        this._store.dispatch(uiActions.stopLoading());
        Swal.fire('Oops', err.message, 'error');
        console.error(err);
      });
  }
}
