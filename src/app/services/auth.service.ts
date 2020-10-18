import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
// import 'firebase/firestore';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return { ...this._user };
  }

  constructor(
    public _AngularFireAuth: AngularFireAuth,
    private _firestore: AngularFirestore,
    private _store: Store<AppState>
  ) {}

  initAuthListener() {
    this._AngularFireAuth.authState.subscribe((fuser) => {
      if (fuser) {
        //existe
        this.userSubscription = this._firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user;
            this._store.dispatch(authActions.setUser({ user: user }));
          });
      } else {
        //no existe
        this._user = null;
        if (this.userSubscription) this.userSubscription.unsubscribe();
        this._store.dispatch(ingresoEgresoActions.unsetItems());
        this._store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this._AngularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this._firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  login(email: string, password: string) {
    return this._AngularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this._AngularFireAuth.signOut();
  }

  isAuth() {
    return this._AngularFireAuth.authState.pipe(map((fuser) => fuser != null));
  }
}
