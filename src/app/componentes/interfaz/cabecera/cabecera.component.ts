import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../../servicios/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  isLoggedIn?: boolean;
  loggedInUser?: string | null;

  constructor(private logginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.logginService.getAuth().subscribe(
      auth => {
        if (auth){
          this.isLoggedIn = true;
          this.loggedInUser = auth.email;
        }else{
          this.isLoggedIn = false;
        }
      }
    );
  }

  logOut() {
    this.logginService.logOut();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
