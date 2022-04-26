import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from "flash-messages-angular";
import {Router} from "@angular/router";
import {LoginService} from "../../../servicios/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = ''; //almacernar el email
  password: string = ''; //almacenar la clave

  /*inyectar servicios a la clase*/
  constructor(private router: Router, private flashMessages: FlashMessagesService, private loginService: LoginService) {
  }

  /*método que se ejecuta cuando se carga el componente*/
  ngOnInit(): void {
    this.autenticacion(); //confirma la autenticacion
  }

  /*método que valida la autenticación del usuario*/
  private autenticacion() {
    this.loginService.getAuth().subscribe(auth => {
      if (auth) {  //si la autenticación es verdadera
        this.router.navigate(['/']); //navega a la ruta raiz
      }
    });
  }

  /*metodo para acceder a la cuenta de usuario*/
  login() {
    this.loginService.login(this.email, this.password).then( //si la autenticacion de la cuenta es verdadera
      res => {
        this.router.navigate(['/']); //navega a la ruta raiz
      }
    ).catch(error => { //en caso que no sea validas las credenciales
      this.flashMessages.show(error.message, { //muestra un mensaje informativo
        cssClass: 'alert-danger', timeout: 4000
      });
    });
  }
}
