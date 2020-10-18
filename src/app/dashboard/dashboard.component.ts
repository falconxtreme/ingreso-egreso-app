import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { filter } from 'rxjs/operators';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  ingresosSubscription: Subscription;

  constructor(
    private _store: Store<AppState>,
    private _ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this._store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.ingresosSubscription = this._ingresoEgresoService
          .initIngresosEgresosListener(user.uid)
          .subscribe((ingresosEgresosFB) => {
            this._store.dispatch(
              ingresosEgresosActions.setItems({ items: ingresosEgresosFB })
            );
          });
      });
  }

  ngOnDestroy() {
    this.ingresosSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
