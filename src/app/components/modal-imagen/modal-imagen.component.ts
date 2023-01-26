import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir?: File | null;
  public imgTemp?: any;

  constructor(
    public serviceModal: ModalImagenService,
    private subirFotoUsuario: FileUploadService
  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.serviceModal.cerrarModal();
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

    const id = this.serviceModal.id;
    const tipo = this.serviceModal.tipo;

    this.subirFotoUsuario.actualizarFoto(
      this.imagenSubir,
      tipo, 
      id
    ).then((img: any) => {
      Swal.fire('Imagen Cambiada', 'Imagen cambiada satisfactoriamente', 'success');
      this.serviceModal.nuevaImagen.emit(img);
      this.cerrarModal();
    }).catch((error) => {
      console.log(error);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }

}
