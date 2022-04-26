import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
/*modulos de firebase*/
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
/*mensajes personalizados*/
import {FlashMessagesModule} from "flash-messages-angular";

import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CabeceraComponent} from './componentes/interfaz/cabecera/cabecera.component';
import {PiePaginaComponent} from './componentes/interfaz/pie-pagina/pie-pagina.component';
import {TableroComponent} from './componentes/presentacion/tablero/tablero.component';
import {LoginComponent} from './componentes/operaciones/login/login.component';
import {LoginService} from "./servicios/login.service";
import {AuthGuard} from "./guardianes/auth.guard";
import {EmpleadoComponent} from './componentes/usuarios/empleado/empleado.component';
import {AdministradorComponent} from './componentes/usuarios/administrador/administrador.component';
import {UsuarioService} from "./servicios/usuario.service";
import {Tipo_vacunasService} from "./servicios/tipo_vacunas.service";
import {EditarEmpleadoComponent} from './componentes/operaciones/editar-empleado/editar-empleado.component';
import {DataTablesModule} from "angular-datatables";
import {EmpleadosService} from "./servicios/empleados.service";

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    PiePaginaComponent,
    TableroComponent,
    LoginComponent,
    EmpleadoComponent,
    AdministradorComponent,
    EditarEmpleadoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlashMessagesModule.forRoot(),
    AngularFireModule.initializeApp(environment.firestore, 'registro-inventario'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    DataTablesModule
  ],
  providers: [
    UsuarioService,
    LoginService,
    AuthGuard,
    Tipo_vacunasService,
    EmpleadosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
