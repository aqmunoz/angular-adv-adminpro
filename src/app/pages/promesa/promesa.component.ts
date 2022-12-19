import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesa',
  templateUrl: './promesa.component.html',
  styles: [
  ]
})
export class PromesaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const promesa = new Promise((resolve, reject) => {
      resolve('Holal mundo');
    });

    promesa.then(() => {
      console.log('Termine');
    });

    console.log('Fin del init');
  }

}
