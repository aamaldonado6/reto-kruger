import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../servicios/login.service";

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css']
})
export class TableroComponent implements OnInit {

  rol: string | undefined = ''; //almacenar el rol del usuario

  /*inyectar servicios a la clase*/
  constructor(private loginServices: LoginService) {
  }

  /*método que se ejecuta al momento de cargar el componente*/
  ngOnInit(): void {
    this.getUsuario(); //obtener datos del usuario autenticado
  }

  /*método para obtener los datos del usuario autenticado*/
  getUsuario() {
    this.loginServices.getAuth().subscribe(
      auth => {
        if (auth) {
          this.rolUsuario(auth.uid) //obtener datos almacenados del usuario
        }
      }
    );
  }

  /*método para obtener los datos almacenados del usuario
    * @param uid, id unico del usuario */
  private rolUsuario(uid: string) {
    this.loginServices.getRolUsuario(uid).subscribe(
      rolUsuario => {
        this.rol = rolUsuario.rol; //obtener y almacenar el rol del usuario
      }
    );
  }
}
