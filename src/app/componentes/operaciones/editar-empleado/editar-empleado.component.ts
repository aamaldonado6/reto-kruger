import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../../servicios/usuario.service";
import {FlashMessagesService} from "flash-messages-angular";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Tipo_vacunasService} from "../../../servicios/tipo_vacunas.service";
import {EmpleadoModel} from "../../../modelo/empleado.model";
import {EmpleadosService} from "../../../servicios/empleados.service";

@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css']
})

export class EditarEmpleadoComponent implements OnInit {

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
  tiposVacunas?: string[]; //almacenar los tipos de vacunas que existen en la bd
  id?: string; //almacenar el id del usuario

  /*inyectar servicios a la clase*/
  constructor(
    private empleadoService: EmpleadosService,
    private usuarioService: UsuarioService,
    private flashMessages: FlashMessagesService,
    private tipoVacunas: Tipo_vacunasService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  /*método que se ejecuta al cargar el componente*/
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; //procesar el id que ofrece la url
    this.getDatosEmpleado(); //obtiene los datos del empleado
    this.getTipoVacunas(); //obtiene los tipos de vacuna que existene en la db
  }

  /*método para obtener los empleados registrados en la db*/
  private getDatosEmpleado() {
    // @ts-ignore
    this.empleadoService.getDatosEmpleado(this.id).subscribe(
      datos => {
        this.empleado = datos; //establece todos los empleados registrados
      }
    );
  }

  /*método para obtener los tipos de vacunas registrados de la db*/
  private getTipoVacunas() {
    this.tipoVacunas.getTipoVacunas().subscribe(
      nombreVacunas => {
        this.tiposVacunas = nombreVacunas.nombre_vacunas; //estable todos los tipos de vacunas de la db
      }
    );
  }

  /*método para actualizar el estado de vacunación del empleado*/
  eliminarEmpleado() {
    if (confirm('Seguro que desea eliminar el Empleado?')) { //modal de confirmación para una acción
      /*elimina los datos de empleado*/
      this.empleadoService.eliminarEmpleado(this.id).then( //si la accion de eliminar es correcta
        res => {
          this.usuarioService.eliminarUsuario(this.id); //elimina la cuenta
          this.router.navigate(['/']); //navegar a la ruta raiz
        }
      );
    }
  }

  /*método para guardar los datos del empleado*/
  guardar(datosExtra: NgForm) {
    if (!datosExtra.valid) { //validar el formulario
      /*mostrar un mensaje de alerta*/
      this.flashMessages.show('Por favor llena el formulario correctamente', {
        cssClass: 'alert-danger', timeout: 4000
      });
    } else {
      if (!this.empleado.estado) { //valida el estado de la vacunación del empleado
        /*en el caso que no tenga vacuna se elimina los registros*/
        this.empleado.tipo_vacuna = '';
        this.empleado.fecha_vacuna = '';
        this.empleado.dosis = 0;
      }
      /*verifica la modificación de los datos del empleado*/
      if (this.empleadoService.modificarDatosEmpleado(this.empleado)) {
        /*mensaje de alerta*/
        this.flashMessages.show('Datos guardados satisfactoriamente', {
          cssClass: 'alert-warning', timeout: 4000
        });
      }
    }
  }

  /*método para obtener la seleccion hecha desde la plantilla*/
  seleccionarVacuna(event: Event) {
    // @ts-ignore
    this.empleado.tipo_vacuna = this.tiposVacunas[(event.target as HTMLInputElement).value]; //guarda la opción seleccionada del html
  }
}
