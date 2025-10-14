import { Component, OnInit } from '@angular/core';
import { DarkService } from '../../../services/darkmode/dark.service';
import { CorsService } from '../../../services/cors/cors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignacion',
  standalone: false,
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss']
})
export class AsignacionComponent implements OnInit {

  mode: boolean = false;

  tableData: any = [];
  cols = [
    'No Empleado', 'Nombre', 'Region', 'Skill', 'Sección', 'Asignados'
  ];
  isData: boolean = true;

  constructor(
                private dark: DarkService,
                private cors: CorsService,
                private router: Router                
              ) 
                {

                }

  ngOnInit(): void {
      this.darkModeSubscription();

      const user = sessionStorage.getItem('name');

      if(user != 'izzi') {
        this.getAnalista(user);
      } else {
        this.getAnalistas();
      } 

  }

  getAnalistas() {
    const data = {
      controlador: 'CargarPlantillaController',
      metodo: 'getAnalistas'
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.tableData = res.data;        
        }
      },
      (err: any) => {

      }
    )
  }
  getAnalista(user: any) {
    const data = {
      controlador: 'CargarPlantillaController',
      metodo: 'getAnalista',
      idAnalista: user
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.tableData = res.data;        
        }
      },
      (err: any) => {
        // console.log(err)
      }
    )
  }

  individual(idAnalista: string) {
    this.router.navigate(['/asignacion/individual', idAnalista]);
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }

}
