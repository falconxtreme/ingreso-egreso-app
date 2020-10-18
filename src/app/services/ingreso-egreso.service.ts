import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(
    private _firestore: AngularFirestore,
    private _authService: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    //todo
    const uid = this._authService.user.uid;
    return this._firestore
      .doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  initIngresosEgresosListener(uid: string) {
    return this._firestore
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          return snapshot.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      );
  }

  borrarIngresoEgreso(uidItem: string) {
    const uid = this._authService.user.uid;
    return this._firestore
      .doc(`${uid}/ingresos-egresos/items/${uidItem}`)
      .delete();
  }
}
