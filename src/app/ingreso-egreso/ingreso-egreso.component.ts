import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm: FormGroup;
  tipo: string = 'ingreso';
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _ingresoEgresoService: IngresoEgresoService,
    private _store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.ingresoEgresoForm = this._formBuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.uiSubscription = this._store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  public guardar() {
    if (this.ingresoEgresoForm.invalid) return;

    this._store.dispatch(uiActions.isLoading());
    const { descripcion, monto } = this.ingresoEgresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this._ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((ref) => {
        this._store.dispatch(uiActions.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((err) => {
        console.error(err);
        this._store.dispatch(uiActions.stopLoading());
        Swal.fire('Registro no creado', err.message, 'error');
      });
  }
}
