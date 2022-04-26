import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TableroComponent} from "./componentes/presentacion/tablero/tablero.component";
import {LoginComponent} from "./componentes/operaciones/login/login.component";
import {AuthGuard} from "./guardianes/auth.guard";
import {EditarEmpleadoComponent} from "./componentes/operaciones/editar-empleado/editar-empleado.component";

const routes: Routes = [
  /*establecer rutas y rutas protegidas*/
  {path: '', component: TableroComponent, canActivate: [AuthGuard]}, //ruta protegida
  {path: 'login', component: LoginComponent},
  {path: 'empleado/editar/:id', component: EditarEmpleadoComponent, canActivate: [AuthGuard]}, //ruta protegida y dinámica
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
