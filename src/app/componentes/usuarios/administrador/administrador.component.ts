import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {FlashMessagesService} from "flash-messages-angular";
import {UsuarioService} from "../../../servicios/usuario.service";
import {Subject} from "rxjs";
import {LoginService} from "../../../servicios/login.service";

import {EmpleadoModel} from "../../../modelo/empleado.model";
import {EmpleadosService} from "../../../servicios/empleados.service";

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit, OnDestroy {

  empleados?: EmpleadoModel[]; //almacena los datos obtenidos de la db
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
  dtOptions: DataTables.Settings = {}; //configuracion del data-table
  dtTrigger: Subject<any> = new Subject<any>(); //trigger del data-table

  /*acceder a componentes secundarios del html*/
  @ViewChild("clienteForm") clienteForm?: NgForm;
  @ViewChild("botonCerrar") botonCerrar?: ElementRef;

  /*inyectar servicios a la clase*/
  constructor(
    private empleadoServicio: EmpleadosService,
    private flashMessages: FlashMessagesService,
    private loginService: LoginService,
    private usuarioService: UsuarioService) {
  }

  /*método que se ejecuta al momento de cargar el componente*/
  ngOnInit(): void {
    this.dtOptions = { //configura las opciones basicas del data-table
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json' //configura el lenguaje a español
      }
    };
    this.obtenerEmpleados(); // obtiene los usuarios registrados
  }

  /*método para obtener todos los empleados registrados en la bd*/
  private obtenerEmpleados() {
    // @ts-ignore
    this.empleadoServicio.getEmpleados().subscribe(
      data => {
        this.empleados = data; //establece los datos capturados
        // @ts-ignore
        this.dtTrigger.next(); // DT trigger que renderiza la tabla
      }
    );
  }

  /*método para agregar un empleado
  * @param usuarioForm, formulario del empleado */
  crearEmpleado(usuarioForm: NgForm) {
    if (!usuarioForm.valid) {
      /*//mensaje de alerta de 4 segundos*/
      this.flashMessages.show('Por favor llena el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    } else {
      this.loginService.nuevoEmpleado(usuarioForm.value.email, usuarioForm.value.cedula).then( //si el registro del usuario fue exitoso
        respose => {
          // @ts-ignore
          let uid = respose.user.uid //id del nuevo usuario agregado
          // @ts-ignore
          this.empleadoServicio.agregarEmpleado(this.empleado, uid); //guarda los datos del nuevo empleado
          this.usuarioService.agregarUsuario({email: usuarioForm.value.email, rol: 'empleado'}, uid) //guarda los datos del nuevo usuario "empleado"
        }
      );
      this.clienteForm?.resetForm(); //limpiar el formulario
      this.cerrarModal(); //cerrar ventana modal
    }
  }

  /*método para cerrar la ventana modal*/
  private cerrarModal() {
    this.botonCerrar?.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
