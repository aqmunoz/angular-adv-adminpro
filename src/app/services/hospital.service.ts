import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseBusquedaHospitales } from '../interfaces/response-busqueda-hospitales';
import { ResponseHospital } from '../interfaces/response-hospitales.interface';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient
  ) { }

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

  cargarHospitales(){
    const url = `${ base_url }/hospitales`;
    return this.http.get<ResponseHospital>( url, this.headers)
      .pipe(
        map( (resp: ResponseHospital ) => resp.hospitales )
      );
  }

  crearHospital (nombre: string | undefined) {
    const url = `${ base_url }/hospitales`;
    return this.http.post( url, { nombre }, this.headers );
  }

  actualizarHospital (_id: string|undefined, nombre: string) {
    const url = `${ base_url }/hospitales/${_id}`;
    return this.http.put( url, { nombre }, this.headers );
  }

  eliminarHospital (_id: string|undefined ) {
    const url = `${ base_url }/hospitales/${_id}`;
    return this.http.delete( url, this.headers );
  }
}
