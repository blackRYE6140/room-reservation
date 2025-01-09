import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import {Chart} from 'chart.js/auto';
import { DashboardService } from "../../service/dashboard/dashboard.service";
import { ThemeService } from "../../service/theme/theme.service";
  
@Component({
  selector: 'app-dashboard',
  providers:[DashboardService],
  standalone: true,
  imports: [ HttpClientModule, CommonModule, ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  darkMode = false;
  nb_clients: any;
  nb_chambres: any;
  nb_reservations: any;
  nb_utilisateurs: any ;
  public Chart1: any ;
  public Chart2: any ;
  public Chart3: any ;

  constructor(private service: DashboardService, private themeService: ThemeService, private http: HttpClient) {}
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.darkMode = mode;
    });
    this.show();
    this.animateText("ROOMS RESERVATIONS");
    this.createChart1();
    this.createChart2();
    this.createChart3();
    this.getDataAndUpdateChart1();
    this.getDataAndUpdateChart2();
    this.getDataAndUpdateChart3();
  }
  
  show(){
    this.service.getCli().subscribe((res: any) => {
      console.log(res, "res==>");
      this.nb_clients = res.data;
    });
    this.service.getCh().subscribe((res: any) => {
      console.log(res, "res==>");
      this.nb_chambres = res.data ;
    });
    this.service.getRes().subscribe((res: any) => {
      console.log(res, "res==>");
      this.nb_reservations = res.data;
    });
    this.service.getUt().subscribe((res: any) => {
      console.log(res, "res==>");
      this.nb_utilisateurs = res.data ;
    });
  }

  
  backgroundColors: string[] = ['#99ABE2', '#444F80', '#10ABE2', '#444F55', '#444F90', '#40ABE2', '#444F75']; 

 


  createChart1() {
    this.Chart1 = new Chart('myChart1', {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: this.backgroundColors 
        }]
      },
      options: {
        aspectRatio: 3 ,
        plugins: { 
          legend: {
            display: true,
            position: 'right',
            labels: {
              font: {
                size: 12 
              }
            } 
          }
        }
      }
    });
  }
  
  getDataAndUpdateChart1() {
    this.http.get<any>('https://hkejpxcvmjrtueiedgdjjhiulpqoiertdgdcgcdd.vercel.app/api/dashboard/nat').subscribe(
      (res) => {
        const data = res.data;
        const labels = data.map((item: any) => item.nat);
        const counts = data.map((item: any) => item.nb_nat);
        this.updateChart1(labels, counts);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
      );
    }
    updateChart1(labels: string[], counts: number[]) {
      // Update chart data
      this.Chart1.data.labels = labels;
      this.Chart1.data.datasets[0].data = counts;
      
      // Update chart background colors
      this.Chart1.data.datasets[0].backgroundColor = this.backgroundColors.slice(0, counts.length);
      
      // Update chart
      this.Chart1.update();
    }

 
    createChart2() {
      this.Chart2 = new Chart('myChart2', {
        type: 'line',
        data: {
          labels: [ ],
          datasets: [{
            label: 'Nombre de client par date',
            data: [ ],
            backgroundColor: 'rgba(255, 99, 132, 0.4)', 
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        },
        options: {
          aspectRatio: 2,
          plugins: { 
            legend: {
              display: true,
              labels: {
                font: {
                  family: 'Arial',
                  size: 14
                }
              }
            }
          },
          scales: {
            y: {
              display: true, // Masquer l'axe y
            },
            x: {
              beginAtZero: false ,
              display: true, // Masquer l'axe x
            }
          },
          elements: {
            line: {
              fill: 'start', // Remplir la zone sous la courbe
              tension: 0.4
            }
          }
        }
      });
    } ;
  

    getDataAndUpdateChart2() {
      this.http.get<any>('https://hkejpxcvmjrtueiedgdjjhiulpqoiertdgdcgcdd.vercel.app/api/dashboard/clientNbr-by-date').subscribe(
        (res) => {
          const data = res.data;
          const labels = data.map((item: any) => item.date_reservation);
          const counts = data.map((item: any) => item.nombre_clients);
          this.updateChart2(labels, counts);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
        );
      }
      updateChart2(labels: string[], counts: number[]) {
        // Update chart data
        this.Chart2.data.labels = labels;
        this.Chart2.data.datasets[0].data = counts;
        // Update chart
        this.Chart2.update();
      }

    
    createChart3() {
      this.Chart3 = new Chart('myChart3', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'revenue par mois',
            data: [],
            backgroundColor: 'rgba(255, 99, 150, 0.4)'
          }]
        },
        options: {
          aspectRatio: 2,
          plugins: { 
            legend: {
              display: true,
              labels: {
                font: {
                  family: 'Arial',
                  size: 14
                }
              }
            }
          },
          scales: {
            y: {
              display: true, 
            },
            x: {
              display: true, 
            }
          },
          
        }
      });  }
  getDataAndUpdateChart3() {
    this.http.get<any>('https://hkejpxcvmjrtueiedgdjjhiulpqoiertdgdcgcdd.vercel.app/api/dashboard/sum-by-month').subscribe(
      (res) => {
        const data = res.data;
        const labels = data.map((item: any) => item.month);
        const counts = data.map((item: any) => item.total);
        this.updateChart(labels, counts);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  updateChart(labels: string[], counts: number[]) {
    // Update chart data
    this.Chart3.data.datasets[0].data = counts;
    this.Chart3.data.labels = labels;

    // Update chart
    this.Chart3.update();
  }
  
  
  animateText(text: string): void {
    const letters = text.split('');
    let animatedText = '';
    const element = document.getElementById('animated-text');
    if (element) {
      for (let i = 0; i < letters.length; i++) {
        setTimeout(() => {
          animatedText += letters[i];
          element.textContent = animatedText;
        }, i * 100);
      }
    } else {
      console.error('Element with id "animated-text" not found.');
    }
  }
 
}
