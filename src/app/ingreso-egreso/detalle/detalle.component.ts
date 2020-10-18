import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubscription: Subscription;

  constructor(
    private _store: Store<AppStateWithIngreso>,
    private _ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubscription = this._store
      .select('ingresosEgresos')
      .subscribe((ingresosEgresos) => {
        this.ingresosEgresos = ingresosEgresos.items;
      });
  }

  ngOnDestroy() {
    this.ingresosSubscription.unsubscribe();
  }

  public borrar(uid: string) {
    console.log(uid);
    this._ingresoEgresoService
      .borrarIngresoEgreso(uid)
      .then(() => {
        Swal.fire('Borrado', 'Item borrado', 'warning');
      })
      .catch((err) => {
        Swal.fire('Error', err.message, 'error');
      });
  }
}
