# Usuarios de Ejemplo para utilizar la aplicación
* Roles de usuario:

  | tipo de usuario | usuario | contraseña 
  | ----|----|--------|
  | administrador | admin@ejemplo.com | 1234567
  | empleado  | marco@ejemplo.com   | 1111111111
# RegistroInventario

Aplicación para llevar un registro del inventario del estado de vacunación de los empleados. Este proyecto está generado
con [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

## Configuración

### Instalación de los paquetes necesarios

`npm i Bootstrap jquery Popper.js`
`npm i angular/fire`
`npm i angular-datatables`
`npm i flash-messages-angular`

## Añadir dependencias en angular.json

```javascript
    "your-app-name"
:
{
  "architect"
:
  {
    "build"
  :
    {
      "options"
    :
      {
        "styles"
      :
        [
          "src/styles.css",
          "node_modules/bootstrap/dist/css/bootstrap.css",
          "node_modules/datatables.net-dt/css/jquery.dataTables.css"
        ],
          "scripts"
      :
        [
          "node_modules/jquery/dist/jquery.js",
          "node_modules/popper.js/dist/umd/popper.js",
          "node_modules/bootstrap/dist/js/bootstrap.bundle.js",
          "node_modules/datatables.net/js/jquery.dataTables.js"
        ],
      ...
      }
    }
```

## Importar los paquetes añadidos en el nivel apropiado de app.module.ts

```javascript
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {DataTablesModule} from "angular-datatables";
import {AppComponent} from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    DataTablesModule,
    FlashMessagesModule.forRoot(),


  ],
  providers: [
    UsuarioService,
    LoginService,
    AuthGuard,
    ConfiguracionService,
    ConfiguracionGuard,
    Tipo_vacunasService,
    DatosExtraService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
```
## Configruracion de Firebase
1. Configruracion de [Firebase](https://console.firebase.google.com).
2. Añadir una aplicación tipo web
3. Ingresar a las configuraciones del proyecto, dirigirse a la vista “general” y copiar la configuración del SDK
4. Establecemos la configuración del SDK en una variable dentro del archivo environment.ts  /src/app/environment
```javascript
firestore = {
  apiKey: "AIzaSyBziIiyeL_r-RzVCGwS2bDe_F-nSjsDpGg",
  authDomain: "angulardemo-48db8.firebaseapp.com",
  databaseURL: "https://angulardemo-48db8-default-rtdb.firebaseio.com",
  projectId: "angulardemo-48db8",
  storageBucket: "angulardemo-48db8.appspot.com",
  messagingSenderId: "54379298042",
  appId: "1:54379298042:web:59b41bc6eff04aee3edd43",
  measurementId: "G-RF2R91G544"
};
```
5. Inicializamos Firebase en app.module.ts desde las configuraciones de environment.ts
``` angularjs
  imports: [
    AngularFireModule.initializeApp(environment.firestore, 'registro-inventario'),
  ],
```
## Creación y consumo de módulos e importaciones
```
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
```
## Crear un guardián para las rutas en auth.guard.ts
````angularjs
canActivate(): Observable<boolean> {
  return this.afAuth.authState.pipe(
    map(auth => {
      if (!auth) { /*si no existe la autenticación*/
        this.router.navigate(['/login']); // dirigirse a la ruta de login
        return false;
      } else {
        return true; //usuario autenticado correctamente
      }
    })
  );
}
````
## Establecer las rutas en app-routing.module.ts y proteger las rutas necesarias
````angularjs
{path: '', component: TableroComponent, canActivate: [AuthGuard]},
{path: 'login', component: LoginComponent},
{path: 'registrarse', component: RegistroComponent, canActivate: [AuthGuard]},
{path: 'empleado/editar/:id', component: EditarEmpleadoComponent, canActivate: [AuthGuard] }, /*ruta dinámica*/
````
## Establecer el modelo de datos para los componentes
#### Modelo "usuario.model.ts"
````angularjs
export interface UsuarioModel {
  /*modelo base de todos los administradores*/
  id?: string;
  email?: string;
  rol?: string;
}
````
#### Modelo "empleado.model.ts"
````angularjs
export interface EmpleadoModel {
  /*modelo base de todos los empleados*/
  id?: string;
  cedula?: number;
  nombres?: string;
  apellidos?: string;
  email?: string;
  nacimiento?: string;
  direccion?: string;
  telefono?: string;
  estado?: boolean;
  tipo_vacuna?: string;
  fecha_vacuna?: string;
  dosis?: number;
}
````
#### Modelo "tipoVacunas.ts"
````angularjs
export interface TipoVacunasModel{
  /*modelo base de los nombres de las vacunas*/
  nombre_vacunas?: [];
}
````
## Establecer los servicios para los componentes
#### Servicio "empleados.service.ts"
````angularjs
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
    this.datosEmpleados = this.datosEmpleadoColeccion.snapshotChanges().pipe( //iterrar los datos obtenidos
    map(data => {
        return data.map(accion => {
        const datos = accion.payload.doc.data() as UsuarioModel; //almacena el modelo de datos obtenido
        datos.id = accion.payload.doc.id; //agregar el id al arreglo de datos
    return datos
})}));
return this.datosEmpleados;
}

/*método que retorna  los datos del empleado
* @param id, id unico del empleado */
getDatosEmpleado(id: string) {
    this.datosEmpleadoDoc = this.db.doc<EmpleadoModel>(`empleados/${id}`); //ruta del nodo a obtener por medio de su id
    this.datosEmpleado = this.datosEmpleadoDoc.snapshotChanges().pipe( //iterrar los datos obtenidos
    map(accion => {
        if (!accion.payload.exists) {
        return null
        } else {
            const datos = accion.payload.data() as EmpleadoModel; //almacena el modelo de datos obtenido
            datos.id = accion.payload.id; //agregar el id al arreglo de datos
        return datos;
    }}));
return this.datosEmpleado;
}

/*método que retorna un boleano destinado para saber si fue efectiva la modificacion de los datos del empleado
* @param empleado, modelo de datos */
modificarDatosEmpleado(empleado: EmpleadoModel) {
  let actualizacion = false;
    this.datosEmpleadoDoc.update(empleado).then( //actualizar el usuario con el nuevo modelo de datos
        function () {
            actualizacion = true;
    });
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
    );});
}
````
#### Servicio "login.service.ts"
````angularjs
/*método que retorna una promesa para saber si el usurio se logeo satisfactoriamente
* @param email, email del usuario
* @param password, contraseña del usuario */
login(email: string, password: string) {
  return new Promise((resolve, reject) => {
    this.authService.signInWithEmailAndPassword(email, password).then(
      datos => resolve(datos),
      error => reject(error)
    )});
}

/*método que retorna el usuario autenticado*/
getAuth() {
  return this.authService.authState.pipe(
    map(auth => auth)
);}

/*método para cerrar sesión*/
logOut() {
  this.authService.signOut();
}

/*método que retorna los datos del usuario destinado para obtener el rol de usuario
* param uid, id del usuario*/
getRolUsuario(uid: string): Observable<UsuarioModel> {
  this.usuarioDoc = this.db.doc<UsuarioModel>(`usuarios/${uid}`);
    this.usuario = this.usuarioDoc.valueChanges();
return this.usuario;
}

/*método que retorna una promesa para saber si los datos del empleado se registraron satisfactoriamente
* @param email, email del usuario
* @param password, contraseña del usuario */
nuevoEmpleado(email: string, password: string) {
  return new Promise((resolve, reject) => {
    this.authService.createUserWithEmailAndPassword(email, password).then(
    datos => resolve(datos),
    error => reject(error)
)});}
````
#### Servicio "login.service.ts"
````angularjs
id = 'vacunas1'; //id definido para el arreglo de vacunas
  
/*método que retorna los tipos de vacunas registrados en la db*/
getTipoVacunas(): Observable<TipoVacunasModel> {
  this.tipoVacunasDoc = this.db.doc<TipoVacunasModel>(`tipo_vacunas/${this.id}`); //ruta los datos segun el id proporcionado
  this.tipoVacunas = this.tipoVacunasDoc.valueChanges(); //obtener los datos
  return this.tipoVacunas;
}
````
#### Servicio "usuario.service.ts"
````angularjs
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
);});}
````
## Estructura de los componentes de la aplicación
![componentes](https://firebasestorage.googleapis.com/v0/b/angulardemo-48db8.appspot.com/o/img%2Festructura.JPG?alt=media&token=1577b977-12f3-4474-a80b-8f03eae3f0a3)
