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
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';


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
              private fb: FormBuilder,
              private messageService: MessageService
             ) {

              this.usuarioEditForm = this.fb.group({
                id_users: ['', [Validators.required]], 
                email: ['', [Validators.required, Validators.email]], 
                user: ['', [Validators.required, Validators.minLength(3)]], 
                name: ['', [Validators.required, Validators.minLength(2)]], 
                rol: [{}, Validators.required] // Campo requerido
              });

             }
  mode: boolean = false;
  usuarios: any[] = [];
  originalUsuarios: any[] = [];
  dropdownItems: SelectItem[] = [];


  headers = ['Nombre', 'Rol','Correo','Usuario','Accion']

  // Filtros
  tipoSeleccioando: any = {};
  agente: any = '';
  rol: any = {};
  fechas: any = [];
  roles: any[] = []
  editUserModal: boolean = false;
  usuarioEdit: any;
  usuarioEditForm: FormGroup;


  ngOnInit(): void {
    this.dropdownItems = [ { label: 'Editar', value: 'editar' }, { label: 'Eliminar', value: 'eliminar' } ];

    this.darkModeSubscription();
    this.getUsers();
    this.getRoles();
  }

  getUsers() {
    const data = {
      controlador: 'LoginController',
      metodo: 'getUsers'
    };
    this.cors.post(data).subscribe(
      (res: any) => {
        this.usuarios = res.data;
        this.originalUsuarios = res.data;

        this.editUserModal = false;
      },
      (err: any) => {
        // console.log(err);
      }
    );
  }

  getRoles() {
    const data = {
      controlador: 'LoginController',
      metodo: 'getRoles'
    };
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.roles = res.data;
        }
      },
      (err: any) => {
        // console.log(err);
      }
    );
  }

  confirmaEliminaUsuario(user: any) {
    Swal.fire({
      title: `¿Desea eliminar al usuario: ${user.user}?`,
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.eliminarUsuario(user.id_users);
    }
    });
  }

  eliminarUsuario(userId: string) {
    const data = {
      controlador: 'LoginController',
      metodo: 'deleteUser',
      userId: userId, 
      active: 0
    };

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.showMessage('success', 'Éxito', res.message);
          this.getUsers();
        }
      },
      (err: any) => {
        // console.log(err)

      }
    )
  }

  editUserFn(user: any) {
    this.editUserModal = true;

    // Para evitar modificar user, crear una copia profunda del objeto
    const copiaUser = JSON.parse(JSON.stringify(user));

    copiaUser.rol = this.roles.find((rol: any) => user.rol === rol.rol)

    this.usuarioEditForm.patchValue(copiaUser);
  }


  filtrarRol() {
    this.usuarios = this.originalUsuarios.filter((usuario: any) => usuario.rol === this.rol.rol)
  }

  filtrarAgente() {
    this.usuarios = this.originalUsuarios.filter(
      (usuario: any) =>
        (usuario.name && usuario.name.toLowerCase().includes(this.agente.toLowerCase())) ||
        (usuario.email && usuario.email.toLowerCase().includes(this.agente.toLowerCase())) ||
        (usuario.user && usuario.user.toLowerCase().includes(this.agente.toLowerCase()))
    );
  }

  limpiarFiltros() {
    this.agente = '';
    this.rol = {};

    this.usuarios = this.originalUsuarios;
  }
  
  

  guardarCambioUsuario() {
    const data = {
      controlador: 'LoginController',
      metodo: 'updateUser',
      data: this.usuarioEditForm.value
    };

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.showMessage('success', 'Éxito', res.message);
          this.getUsers();
          this.editUserModal = false;
        }

        if(res.status === 'info') {
          this.showMessage('success', 'Éxito', res.message);
        }
      },
      (err: any) => {
        this.showMessage('error', 'Error', err.message);
      }
    )
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

