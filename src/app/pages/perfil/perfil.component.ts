import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir?: File | null;
  public imgTemp?: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private subirFotoUsuario: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      'nombre': [this.usuario.nombre, Validators.required],
      'email': [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    //console.log(this.perfilForm.value);return;
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe( () => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Actualizado', 'Actualización ejecutada satisfactoriamente', 'success');
      }, (error) => {
        Swal.fire('Error', error.error.msg, 'error');
      });
  }

  cambiarImagen(event: Event) {
    this.imagenSubir = (event.target as HTMLInputElement).files?.item(0);
    
    if (!this.imagenSubir) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( this.imagenSubir );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.subirFotoUsuario.actualizarFoto(
      this.imagenSubir,
      'usuarios', 
      this.usuario.uid
    ).then((img: any) => {
      this.usuario.img = img;
      Swal.fire('Imagen Cambiada', 'Imagen cambiada satisfactoriamente', 'success');
    }).catch((error) => {
      console.log(error);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }

}
