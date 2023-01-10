import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  get token(): string {
    return localStorage.getItem('token') ||  '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  logout() {
    localStorage.removeItem('token');
    
    this.router.navigateByUrl('/login');
  }

  validarToken (): Observable<boolean> {
    return this.httpClient.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      tap((resp: any) => {
        const { nombre, email, role, google, img = '', uid } = resp.usuario;
        this.usuario = new Usuario( nombre,email, '', img, google, role, uid);

        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.httpClient.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  actualizarPerfil (data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role || ''
    }
    return this.httpClient.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {

    if (formData.remember) {
      let email = formData.email || '';
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    return this.httpClient.post(`${base_url}/login`, formData)
    .pipe(
      map((resp: any) => {
        localStorage.setItem('id', resp.id);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));

        return true;
      }),
      catchError((error) => {
        let campoError = Object.keys(error.error)[1];
        let errores = error.error[campoError];
        let msgGeneral = '';
        if (typeof errores === 'object') {
          let erroresTemp = [];
          for(let item in errores) {
            let temp = errores[item];
            erroresTemp.push(temp.msg);
          }
          msgGeneral = erroresTemp.join(', \n');
        } else {
          msgGeneral = errores;
        }

        return throwError(() => new Error(msgGeneral));
      })
    );
  }
}
