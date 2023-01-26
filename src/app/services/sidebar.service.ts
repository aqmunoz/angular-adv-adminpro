import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        {
          titulo: 'Main',
          url: '/'
        },
        {
          titulo: 'ProgressBar',
          url: 'progress'
        },
        {
          titulo: 'Gráficas',
          url: 'grafica1'
        },
        {
          titulo: 'RxJS',
          url: 'rxjs'
        },
        {
          titulo: 'Promesas',
          url: 'promesa'
        }
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        {
          titulo: 'Usuarios',
          url: 'usuarios'
        },
        {
          titulo: 'Hospitales',
          url: 'hospitales'
        },
        {
          titulo: 'Médicos',
          url: 'medicos'
        }
      ]
    }
  ];

  constructor() { }
}
