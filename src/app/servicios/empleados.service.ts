import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {map, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UsuarioModel} from "../modelo/usuario.model";
import {EmpleadoModel} from "../modelo/empleado.model";

@Injectable()
export class EmpleadosService {

  datosEmpleadoColeccion?: AngularFirestoreCollection<EmpleadoModel>; //colección de la db de Firebase
  datosEmpleado?: Observable<EmpleadoModel> //almacena los datos del empleado
  datosEmpleadoDoc?: AngularFirestoreDocument<EmpleadoModel>; //documeto de la db de Firebase
  datosEmpleados?: Observable<EmpleadoModel[]>; //almacenar todos los empleados

  /*inyectar servicios a la clase*/
  constructor(private db: AngularFirestore) {
    this.datosEmpleadoColeccion = db.collection('empleados'); //ruta de la colección de la db
  }

  /*método para agregar el nuevo empleado
* @param value, modelo de datos
* @param idEmpleado, uid del empleado */
  agregarEmpleado(value: EmpleadoModel, idEmpleado: string) {
    this.datosEmpleadoColeccion?.doc(idEmpleado).set(value); //guarda los datos
  }

  /*método que retorna todos los empleados registrados*/
  getEmpleados(): Observable<EmpleadoModel[]> {
    // @ts-ignore
    this.datosEmpleados = this.datosEmpleadoColeccion.snapshotChanges().pipe( //iterrar los datos obtenidos
      map(data => {
        return data.map(accion => {
          const datos = accion.payload.doc.data() as UsuarioModel; //almacena el modelo de datos obtenido
          datos.id = accion.payload.doc.id; //agregar el id al arreglo de datos
          return datos
        })
      })
    );
    return this.datosEmpleados;
  }

  /*método que retorna  los datos del empleado
    * @param id, id unico del empleado */
  getDatosEmpleado(id: string) {
    this.datosEmpleadoDoc = this.db.doc<EmpleadoModel>(`empleados/${id}`); //ruta del nodo a obtener por medio de su id
    // @ts-ignore
    this.datosEmpleado = this.datosEmpleadoDoc.snapshotChanges().pipe( //iterrar los datos obtenidos
      map(accion => {
          if (!accion.payload.exists) {
            return null
          } else {
            const datos = accion.payload.data() as EmpleadoModel; //almacena el modelo de datos obtenido
            datos.id = accion.payload.id; //agregar el id al arreglo de datos
            return datos;
          }
        }
      )
    );
    return this.datosEmpleado;
  }

  /*método que retorna un boleano destinado para saber si fue efectiva la modificacion de los datos del empleado
    * @param empleado, modelo de datos */
  modificarDatosEmpleado(empleado: EmpleadoModel) {
    let actualizacion = false;
    // @ts-ignore
    this.datosEmpleadoDoc.update(empleado).then( //actualizar el usuario con el nuevo modelo de datos
      function () {
        actualizacion = true;
      }
    );
    return this.datosEmpleadoDoc;
  }

  /*método que retorna una promesa para saber si el empleado fue eliminado
    * @param uid, id del empleado */
  eliminarEmpleado(uid: string | undefined) {
    this.datosEmpleadoDoc = this.db.doc(`empleados/${uid}`); //ruta del nodo a modificar por su id
    return new Promise((resolve, reject) => {
      this.datosEmpleadoDoc?.delete().then(
        datos => resolve(datos),
        error => reject(error)
      );
    });
  }

}
