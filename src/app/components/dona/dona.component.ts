import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {
  @Input() title: string = 'Sin titulo';
  // Doughnut
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: []};

  constructor() { }

  ngOnInit(): void {
    this.doughnutChartData = {
      labels: this.labels,
      datasets: [
        { 
          data: this.data
        }
      ]
    };
  }





   

}
