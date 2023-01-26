import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  
  public imagenSubscription!: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) { }

  ngOnDestroy(): void {
    this.imagenSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imagenSubscription = this.modalImagenService.nuevaImagen.subscribe(img => this.cargarMedicos())
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.getMedicos()
      .subscribe((medicos) => {
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos',medico._id,medico.img);
  }

  buscar(termino: string) {
    if( termino.trim().length > 0 ) {
      this.busquedaService.buscar('medicos', termino)
        .subscribe((medicos) => {
          this.medicos = medicos;
        })
    }
  }

  borrarMedico (medico: Medico) {

    Swal.fire({
      title:'¿Borrar médico?',
      text: `Está a punto de borrar el médico ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((resp) => {
      if (resp.value) {
        this.medicoService.eliminarMedico(medico._id)
          .subscribe((resp) => {
            Swal.fire(
              'Médico borrado',
              `El médico ${medico.nombre} fue eliminado satisfactoriamente`,
              'success'
            ).then(() => this.cargarMedicos());

          });
      }
    });
  }

}
