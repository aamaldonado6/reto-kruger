import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {FlashMessagesService} from "flash-messages-angular";
import {LoginService} from "../../../servicios/login.service";
import {Tipo_vacunasService} from "../../../servicios/tipo_vacunas.service";
import {EmpleadoModel} from "../../../modelo/empleado.model";
import {EmpleadosService} from "../../../servicios/empleados.service";

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  /*definir un objeto vacio para manejar los datos*/
  empleado: EmpleadoModel = {
    cedula: undefined,
    nombres: '',
    apellidos: '',
    email: '',
    nacimiento: '',
    direccion: '',
    telefono: '',
    estado: false,
    tipo_vacuna: '',
    fecha_vacuna: '',
    dosis: 0,
  }
  tiposVacunas?: string[]; //almacena todos los nombres de las vacunas
  idEmpleado: string = ''; //almacena el id del empleado

  /*inyectar servicios a la clase*/
  constructor(
    private empleadoServicio: EmpleadosService,
    private flashMessages: FlashMessagesService,
    private loginService: LoginService,
    private tipoVacunas: Tipo_vacunasService,
  ) {
  }

  /*método que se ejecuta al momento de cargar el componente*/
  ngOnInit(): void {
    this.getUsuarioAuth(); //obtener datos del usuario autenticado
    this.getTipoVacunas(); //obtener los diferentes tipos de vaunas registradas
  }

  /*método para obtener los datos del usuario autenticado*/
  getUsuarioAuth() {
    this.loginService.getAuth().subscribe(
      auth => {
        if (auth) {
          this.idEmpleado = auth.uid
          this.getEmpleado(this.idEmpleado) //obtener datos almacenados del empleado
        }
      }
    );
  }

  /*método para obtener los datos del empleado
* @param uid, id del empleado */
  private getEmpleado(uid: string) {
    // @ts-ignore
    this.empleadoServicio.getDatosEmpleado(uid).subscribe(
      data => {
        this.empleado = data; //almacena los datos del empleado capturado
      }
    );
  }

  /*método para guardar los datos del empleado
* @param datos, formulario capturado */
  guardar(datos: NgForm) {
    if (!datos.valid) {
      /*mensaje de alerta de 4 segundos*/
      this.flashMessages.show('Por favor llena el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    } else {
      if (!this.empleado.estado) { //elimina los datos si el estado de vacunacion es falso
        this.empleado.tipo_vacuna = '';
        this.empleado.fecha_vacuna = '';
        this.empleado.dosis = 0;
      }
      /*modificar catos*/
      if (this.empleadoServicio.modificarDatosEmpleado(this.empleado)) {//si la actualizacion fue exitosa
        /*muestra una alerta de 4 segundos*/
        this.flashMessages.show('Datos guardados satisfactoriamente', {
          cssClass: 'alert-warning', timeout: 4000
        });
      }
    }
  }

  /*método para obtener los nombres de vacunas*/
  private getTipoVacunas() {
    this.tipoVacunas.getTipoVacunas().subscribe(
      nombreVacunas => {
        this.tiposVacunas = nombreVacunas.nombre_vacunas; //almacena los nombres de las vacunas
      }
    );
  }

  /*método que captura el valor del elemento seleccionado en el html*/
  seleccionarVacuna(event: Event) {
    // @ts-ignore
    this.empleado.tipo_vacuna = this.tiposVacunas[(event.target as HTMLInputElement).value]; //almacena el nombre de la vacuna seleccionada
  }
}
