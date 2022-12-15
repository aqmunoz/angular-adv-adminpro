import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public labels1: string[] = [ 'Pan', 'Galletas', 'Tostadas' ];
  public data1: number[] = [ 10, 5, 100 ]
  public labels2: string[] = [ 'Bicicleta', 'Motorina', 'Motor' ];
  public data2: number[] = [ 100, 500, 100 ]
  public labels3: string[] = [ 'Perfume', 'Colonia', 'Crema' ];
  public data3: number[] = [ 105, 55, 10 ]
  public labels4: string[] = [ 'Albóndigas', 'Carne', 'Pollo' ];
  public data4: number[] = [ 150, 65, 1000 ]

  constructor() { }

  ngOnInit(): void {
  }

 

}
