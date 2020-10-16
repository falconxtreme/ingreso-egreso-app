import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _FormBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this._FormBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public login() {
    if (this.loginForm.invalid) return;

    Swal.fire('Espere por favor...', '', 'info');
    Swal.showLoading();
    const { correo, password } = this.loginForm.value;
    this._authService
      .login(correo, password)
      .then((credenciales) => {
        Swal.close();
        console.log(credenciales);
        this._router.navigate(['/']);
      })
      .catch((err) => {
        Swal.fire('Oops', err.message, 'error');
        console.error(err);
      });
  }
}
