import {CanActivate, Router} from "@angular/router";
import {Inject, Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map, Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
  ) {
  }

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
}
