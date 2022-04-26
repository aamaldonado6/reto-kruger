import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UsuarioModel} from "../modelo/usuario.model";

@Injectable() //agregar otros servicios
export class UsuarioService {

  usuariosColeccion?: AngularFirestoreCollection<UsuarioModel>; //coleccion de la bd de Firebase
  usuarioDoc?: AngularFirestoreDocument<UsuarioModel>; //documento coleccion de la bd  de Firebase
  usuarios?: Observable<UsuarioModel[]>; //almacenar todos los usuarios
  usuario?: Observable<UsuarioModel> //almacenar un usuario

  /*inyectar servicios a la clase*/
  constructor(private db: AngularFirestore) {
    this.usuariosColeccion = db.collection('usuarios'); //ruta del nodo ordenado por su nombre de forma ascendente
  }

  /*método para agregar un usuario
  * @param value, modelo de datos del usuario */
  agregarUsuario(value: UsuarioModel, id: string) {
    this.usuariosColeccion?.doc(id).set(value); //añade un nuevo usuario a la colección definida
  }

  /*método que retorna una promesa para saber si el usuario fue eliminado
    * @param uid, id del usuario */
  eliminarUsuario(uid: string | undefined) {
    this.usuarioDoc = this.db.doc(`usuarios/${uid}`); //ruta del nodo a modificar por su id
    return new Promise((resolve, reject) => {
      this.usuarioDoc?.delete().then( //eliminar el usuario
        datos => resolve(datos),
        error => reject(error)
      );
    });
  }
}
