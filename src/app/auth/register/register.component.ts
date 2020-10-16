import { compileNgModule } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.registroForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public crearUsuario() {
    if (this.registroForm.invalid) return;

    Swal.fire('Espere por favor...', '', 'info');
    Swal.showLoading();
    const { nombre, correo, password } = this.registroForm.value;
    this._authService
      .crearUsuario(nombre, correo, password)
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
