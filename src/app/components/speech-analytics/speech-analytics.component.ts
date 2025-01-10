import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'speech-analytics',
  templateUrl: './speech-analytics.component.html',
  styleUrls: ['./speech-analytics.component.scss']
})
export class SpeechAnalyticsComponent implements OnInit {
  sentimientosChart: any;
  sentimientosOptions: any;

  barData: any;
  barOptions: any;

  ngOnInit(): void {
      this.construyeGraph();
  }

  construyeGraph() {
    this.sentimientosChart = {
      labels: ['Gratitud', 'Confusión', 'Frustración'],
      datasets: [
          {
              data: [10, 30, 60],
              backgroundColor: [
                  '#FC6161',
                  '#00D0DE',
                  '#873EFE'
              ],
              hoverBackgroundColor: [
                  '#FC6161',
                  '#00D0DE',
                  '#873EFE'
              ],
              borderColor: 'transparent',
              fill: true
          }
      ]
    };
    
    this.sentimientosOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#ebedef'
              }
          }
      }
    };

    this.barData = {
      labels: ['Frustración', 'Insatisfacción', 'Gratitud', 'Neutral', 'Enojo'],
      datasets: [
        {
          backgroundColor: ['#2596be', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6'], // Colores diferentes para cada barra
          data: [10, 20, 30, 40, 50]
        }
      ]
    };
    
    

    this.barOptions = {
      plugins: {
          legend: {
            display: false,
              labels: {
                  color: '#44486D'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#ebedef'
              },
              grid: {
                  color:  '#ebedef',
              }
          },
          y: {
              ticks: {
                  color: '#ebedef'
              },
              grid: {
                  color:  '#ebedef',
              }
          },
      }
    };


  }
}

