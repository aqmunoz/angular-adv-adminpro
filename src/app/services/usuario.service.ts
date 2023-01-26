import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

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

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
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
    return this.httpClient.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
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

  cargarUsuarios(desde: number = 0){
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.httpClient.get<CargarUsuarios>( url, this.headers)
      .pipe(
        map( resp => {
          const usuarios = resp.usuarios.map(
            usuario => new Usuario(usuario.nombre, usuario.email, '', usuario.img, usuario.google, usuario.role, usuario.uid)
          );
          return {
            total: resp.total,
            usuarios
          };
        })
      );
  }

  eliminarUsuario( usuario: Usuario ) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.httpClient.delete(url, this.headers);
  }

  guardarUsuario (usuario: Usuario) {

    return this.httpClient.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
