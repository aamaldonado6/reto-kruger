import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {TipoVacunasModel} from "../modelo/tipoVacunas.model";

@Injectable()
export class Tipo_vacunasService {
  tipoVacunasDoc?: AngularFirestoreDocument<TipoVacunasModel>; //documento de la bd de Firebase
  tipoVacunas?: Observable<TipoVacunasModel> //variable para almacenar los tipos de vacunas
  //id unico de la conleccion
  id = 'vacunas1'; //id definido para el arreglo de vacunas

  /*inyectar servicios a la clase*/
  constructor(private db: AngularFirestore) {
  }

  /*método que retorna los tipos de vacunas registrados en la db*/
  getTipoVacunas(): Observable<TipoVacunasModel> {
    this.tipoVacunasDoc = this.db.doc<TipoVacunasModel>(`tipo_vacunas/${this.id}`); //ruta los datos segun el id proporcionado
    // @ts-ignore
    this.tipoVacunas = this.tipoVacunasDoc.valueChanges(); //obtener los datos
    // @ts-ignore
    return this.tipoVacunas;
  }

}
