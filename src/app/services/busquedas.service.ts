import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') ||  '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuario(resultados: any): Usuario[] {
    return resultados.map(
      (user: Usuario) => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private transformarHospital(resultados: any): Hospital[] {
    return resultados.map(
      (hospital: Hospital) => new Hospital(hospital.nombre, hospital._id, hospital.img, hospital.usuario)
    );
  }

  private transformarMedico(resultados: any): Medico[] {
    return resultados.map(
      (medico: Medico) => new Medico(medico.nombre, medico._id, medico.img, medico.usuario, medico.hospital)
    );
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    const url = `${ base_url }/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>( url, this.headers)
      .pipe(
        map((resp: any) => {
          let temp: any[] = [];
          switch (tipo) {
            case 'usuarios':
              temp = this.transformarUsuario(resp.resultados);
              break;

            case 'hospitales':
              temp = this.transformarHospital(resp.resultados);
              break;

            case 'medicos':
              temp = this.transformarMedico(resp.resultados);
              break;
          
            default:
              break;
          }

          return temp;
        })
      );
  }
}
