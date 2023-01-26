import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public imagenSubscription!: Subscription;

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedaService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnDestroy(): void {
    this.imagenSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imagenSubscription = this.modalImagenService.nuevaImagen.subscribe(img => this.cargarUsuarios())
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if (termino.length === 0){
      this.usuarios = this.usuariosTemp;
    } else{      
          this.busquedaService.buscar('usuarios', termino)
            .subscribe((resultados) => {
              this.usuarios = resultados;
            });
    }
  }

  eliminarUsuario(usuario: Usuario) {

    if ( usuario.uid === this.usuarioService.uid ) {
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    } else {

      Swal.fire({
        title:'¿Borrar usuario?',
        text: `Está a punto de borrar el usuario ${usuario.nombre}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, borrarlo'
      }).then((resp) => {
        if (resp.value) {
          this.usuarioService.eliminarUsuario(usuario)
            .subscribe((resp) => {
              this.cargarUsuarios(); 
              
              Swal.fire(
                'Usuario borrado',
                `El usuario ${usuario.nombre} fue eliminado satisfactoriamente`,
                'success'
              );
  
            });
        }
      });
    }

  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(
        resp => {
          console.log(resp);
        }
      );
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.img);
  }

}
