import { compileNgModule } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import * as uiActions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  uiSubscription: Subscription;
  loading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registroForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this._store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  public crearUsuario() {
    if (this.registroForm.invalid) return;

    this._store.dispatch(uiActions.isLoading());
    // Swal.fire('Espere por favor...', '', 'info');
    // Swal.showLoading();
    const { nombre, correo, password } = this.registroForm.value;
    this._authService
      .crearUsuario(nombre, correo, password)
      .then((credenciales) => {
        // Swal.close();
        console.log(credenciales);
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
