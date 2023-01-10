import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto( 
    archivo: File | null | undefined,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string | undefined
  ) {


    try {

      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();
      if (archivo) {
        formData.append('imagen', archivo);
        
        const resp = await fetch(url, {
          method: 'PUT',
          headers: {
            'x-token': localStorage.getItem('token') || ''
          },
          body: formData
        });

        const data = await resp.json();
        if ( data.ok ) {
          return data.nombreArchivo;
        } else {
          console.log(data.msg);
          return false;
        }
      } else {
        return false;
      }

      
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
