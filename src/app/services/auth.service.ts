import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
// import 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public _AngularFireAuth: AngularFireAuth,
    private _firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this._AngularFireAuth.authState.subscribe((fuser) => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
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
