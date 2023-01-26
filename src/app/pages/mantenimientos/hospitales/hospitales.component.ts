import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imagenSubscription!: Subscription;

  public terminoBusqueda: string = '';

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) { }


  ngOnDestroy(): void {
    this.imagenSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imagenSubscription = this.modalImagenService.nuevaImagen.subscribe(img => this.cargarHospitales())
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales) => {
        this.cargando = false;
        this.hospitales = hospitales;
      });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.eliminarHospital(hospital._id)
      .subscribe((resp) => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert() {
    const { value: nombre = '' } = await Swal.fire<string>({
      text: 'Ingrese el nuevo nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (nombre!.trim().length > 0 ) {
      this.crearHospital(nombre);
    }

  }

  crearHospital(nombre: string | undefined) {
    this.hospitalService.crearHospital(nombre)
      .subscribe((resp) => {
        this.cargarHospitales();
        Swal.fire('Creado', nombre, 'success');
      });
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img);
  }

  buscarHospital() {
    if( this.terminoBusqueda.trim().length > 0 ) {
      this.busquedaService.buscar('hospitales', this.terminoBusqueda)
        .subscribe((hospitales) => {
          this.hospitales = hospitales;
        })
    }
  }

}
