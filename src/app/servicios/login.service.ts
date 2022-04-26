import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map, Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {UsuarioModel} from "../modelo/usuario.model";


@Injectable() //agregar otros servicios
export class LoginService {

  usuarioDoc?: AngularFirestoreDocument<UsuarioModel>;//documeto de la db de Firebase
  usuario?: Observable<UsuarioModel> //modelo del usuario

  /*inyectar servicios a la clase*/
  constructor(private authService: AngularFireAuth, private db: AngularFirestore) {
  }

  /*método que retorna una promesa para saber si el usurio se logeo satisfactoriamente
  * @param email, email del usuario
  * @param password, contraseña del usuario */
  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.authService.signInWithEmailAndPassword(email, password).then(
        datos => resolve(datos),
        error => reject(error)
      )
    });
  }

  /*método que retorna el usuario autenticado*/
  getAuth() {
    return this.authService.authState.pipe(
      map(auth => auth)
    );
  }

  /*método para cerrar sesión*/
  logOut() {
    this.authService.signOut();
  }

  /*método que retorna una promesa para saber si los datos del empleado se registraron satisfactoriamente
 * @param email, email del usuario
 * @param password, contraseña del usuario */
  nuevoEmpleado(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.authService.createUserWithEmailAndPassword(email, password).then(
        datos => resolve(datos),
        error => reject(error)
      )
    });
  }

  /*método que retorna los datos del usuario destinado para obtener el rol de usuario
  * param uid, id del usuario*/
  getRolUsuario(uid: string): Observable<UsuarioModel> {
    this.usuarioDoc = this.db.doc<UsuarioModel>(`usuarios/${uid}`);
    // @ts-ignore
    this.usuario = this.usuarioDoc.valueChanges();
    // @ts-ignore
    return this.usuario;
  }
}
