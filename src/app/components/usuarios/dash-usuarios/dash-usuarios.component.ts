import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { CorsService } from '../../../services/cors/cors.service';
import { DarkService } from '../../../services/darkmode/dark.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Calendar } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'dash-usuarios',
  templateUrl: './dash-usuarios.component.html',
  styleUrls: ['./dash-usuarios.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashUsuariosComponent implements OnInit {

  @ViewChild('myCalendar', { static: true }) myCalendar!: Calendar;


  constructor(private cors: CorsService, 
              private dark: DarkService, 
              private router: Router, 
              private route: ActivatedRoute,
              private messageService: MessageService
             ) {}
  mode: boolean = false;
  usuarios: any[] = [];
  dropdownItems: SelectItem[] = [];


  headers = ['Agente', 'Role','Correo','Usuario','Accion']

  // Filtros
  tipo: any[] = [];
  tipoSeleccioando: any = {};
  agente: any = '';
  fechas: any = [];

  ngOnInit(): void {
    this.tipo = [
      { name: 'Revisado', code: 1 },
      { name: 'Sin revisar', code: 0 },
    ];
    this.dropdownItems = [ { label: ' ', value: '' }, { label: 'Editar', value: 'editar' }, { label: 'Eliminar', value: 'eliminar' } ];

    let iduser = '';

    this.darkModeSubscription();
    this.getusers(iduser)
  }
  editar(audio: any) {
    this.router.navigate(['/usuarios/editar', audio.id_users]);
  }

  eliminar(audio: any) {
    // Lógica para eliminar
    console.log('Eliminar');
  }

  getusers(iduser: string) {
    const data = {
      controlador: 'LoginController',
      metodo: 'getUsers',
      iduser
    };
    this.cors.post(data).subscribe(
      (res: any) => {
        this.usuarios = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  onDropdownChange(event: any, audio: any) { 
    if (event.value === 'editar') {
      this.editar(audio); 
    } 
    else if (event.value === 'eliminar') {
       this.eliminar(audio); 
      } 
  }


  filtrando() {

    if(this.agente != '') {
      this.filtraragente();  
    }
  }

  filtraragente() {
    let numeros: boolean = false;
    let letras: boolean = false;

    numeros = /\d/.test(this.agente);
    letras = /^[a-zA-Z\s]+$/.test(this.agente);

    if(numeros) {
      this.usuarios = this.usuarios.filter((audio: any) => {
        return audio.idagente.includes(this.agente);
      });
    }

    if(letras) {
      this.usuarios = this.usuarios.filter((audio: any) => {
        return audio.nomagente.toLowerCase().includes(this.agente.toLowerCase());
      });
    }
  }


  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }
}

