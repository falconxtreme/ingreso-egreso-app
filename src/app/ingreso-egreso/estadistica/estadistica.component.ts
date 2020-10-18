import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { MultiDataSet, Label } from 'ng2-charts';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];

  constructor(private _store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this._store.select('ingresosEgresos').subscribe(({ items }) => {
      this.generarEstadistica(items);
    });
  }

  ngOnDestroy() {}

  generarEstadistica(items: IngresoEgreso[]) {
    this.resetValues();
    items.forEach((item) => {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    });

    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }

  private resetValues() {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;
  }
}
