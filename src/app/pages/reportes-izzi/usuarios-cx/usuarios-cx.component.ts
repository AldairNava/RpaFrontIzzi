import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CorsService } from '@services';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';

@Component({
  selector: 'usuarios-cx',
  templateUrl: './usuarios-cx.component.html',
  styleUrls: ['./usuarios-cx.component.scss']
})
export class UsuariosCXComponent implements OnInit {
  dataSource: any[] = []
    loading: boolean = false
    items: any[] = [];
    opcionToAction: any = { };
    opcionIndex: any = null;
    displayLogDialog: boolean = false
    loadingLog: boolean = false
    logContent: any[] = []
    statusOptions = [
      { label: 'Activo', value: 'Activo' },
      { label: 'Desactivado', value: 'Desactivado' }
  ];
    displayEditDialog: boolean = false;
  editUser: any = null;
  displayPasswordDialog: boolean = false;
  passwordConfirm: string = "";
  saving: boolean = false;
  usuarioEliminar: any = null;
  displayDeletePasswordDialog: boolean = false;
  passwordDeleteConfirm: string = "";

    rolesOptions: any[] = [
      { label: 'administrador', value: 'administrador' },
      { label: 'admin-ajustesSucursales', value: 'admin-ajustesSucursales' },
      { label: 'admin-rpacx', value: 'admin-rpacx' },
      { label: 'Reporte', value: 'Reporte' },
      { label: 'Extraccion', value: 'Extraccion' },
      { label: 'Depuracion', value: 'Depuracion' },
      { label: 'Ajustes', value: 'Ajustes' },
      { label: 'AjustesNotDone', value: 'AjustesNotDone' },
      { label: 'testAjustes1', value: 'testAjustes1' },
      { label: 'eBarrera', value: 'eBarrera' },
      { label: 'testReportes', value: 'testReportes' },
      { label: 'ACS', value: 'ACS' },
      { label: 'recuperadores', value: 'recuperadores' }
  ];
  usuarioActual: any = JSON.parse(sessionStorage.getItem("user") || "{}");
  allowedRoles: string[] = [
    'administrador',
    'admin-ajustesSucursales',
    'admin-cx',
    'admin-recuperadores'
  ];

  isAdmin: boolean = false;


  
    constructor(
      private router: Router,
      private service: MessageService,
      private message: MessageService,
      private confirmationService: ConfirmationService,
      private socket: Socket,
      private cors: CorsService,
    ) {
      this.items = [{
    label: 'Actualizar', icon: 'pi pi-refresh', command: () => {
        this.abrirDialogoEditarUsuario(this.opcionToAction);
    }
      },
      {
        label: ' ', icon: ' '
      },
      {
          label: 'Eliminar', icon: 'pi pi-times', command: () => {
              this.preguntarEliminarUsuario(this.opcionToAction);
          }
      }]
     }
  
  ngOnInit(): void {
    this.validarPermiso();
    this.getAllUsuarios();
  }
  validarPermiso() {
    const usuario = JSON.parse(sessionStorage.getItem("user") || "{}");
    this.isAdmin = usuario?.Role && this.allowedRoles.includes(usuario.Role);
  }

  abrirDialogoEditarUsuario(usuario: any) {
      this.editUser = { ...usuario };
      this.displayEditDialog = true;
  }
  guardarCambiosUsuario() {
      if (!this.usuarioActual?.email) {
          this.message.add({
              key: 'tst',
              severity: 'error',
              summary: 'Error',
              detail: 'No se puede actualizar porque se requiere un usuario.',
          });
          return;
      }
      this.displayPasswordDialog = true;
      this.passwordConfirm = "";
  }
  confirmarGuardarCambiosUsuario() {
      this.saving = true;
      const body = {
          ...this.editUser,
          editor: this.usuarioActual.email,
          passwordConfirm: this.passwordConfirm
      };
      this.cors.put(`Usuarios/ActualizarUsuario?id=${this.editUser.id}`, body)
          .then(response => {
              this.saving = false;
              this.showToastSuccess('Usuario actualizado correctamente');
              this.displayPasswordDialog = false;
              this.displayEditDialog = false;
              this.getAllUsuarios();
          })
          .catch(error => {
          let msg = 'Error al actualizar el usuario';
          if (typeof error?.error === 'string') {
              msg = error.error;
          } else if (typeof error?.error === 'object' && error?.error?.message) {
              msg = error.error.message;
          }
          this.showToastError(msg);
      });

  }

  showToastSuccess(mensaje: any) {
    this.message.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje, });
  }
  showToastError(mensaje: any) {
    this.message.add({ key: 'tst', severity: 'error', summary: 'Error!!', detail: mensaje, });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  selection(item: any, index: any) {
    this.opcionToAction = item;
    this.opcionIndex = index;
  }
  
  preguntarEliminarUsuario(usuario: any) {
    this.usuarioEliminar = usuario;
    this.passwordDeleteConfirm = "";
    this.displayDeletePasswordDialog = true;
}

  eliminarUsuarioConfirmado() {
    const usuario = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!usuario?.email) {
        this.message.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'Se requiere usuario logueado.',
        });
        return;
    }

    const body = {
        ...this.usuarioEliminar,
        status: "Inactivo",         // <- fuerza el estatus a Inactivo
        editor: usuario.email,
        passwordConfirm: this.passwordDeleteConfirm
    };

    this.cors.put(`Usuarios/ActualizarUsuario?id=${this.usuarioEliminar.id}`, body)
        .then(response => {
            this.showToastSuccess('Usuario desactivado correctamente');
            this.displayDeletePasswordDialog = false;
            this.getAllUsuarios();
        })
        .catch(error => {
            let msg = 'Error al desactivar el usuario';
            if (typeof error?.error === 'string') msg = error.error;
            else if (typeof error?.error === 'object' && error?.error?.message) msg = error.error.message;
            this.showToastError(msg);
        });
}



  getAllUsuarios(){
  this.cors.get('Usuarios/getUsuarios').then((response) => {
    if(response[0] == 'SIN INFO'){
      this.showToastError(`No hay registros de usuarios!`)
    }else{
      this.filtrarPorRol(response);
    }
  }).catch((error) => {
    console.log(error);
    this.showToastError(`No se logró traer la lista de usuarios!`)
  })
}

filtrarPorRol(usuarios: any[]) {
  const usuario = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = usuario?.Role;

  if(role === 'administrador') {
    this.dataSource = usuarios;
  } else if(role === 'admin-cx') {
    this.dataSource = usuarios.filter(
      u => u.area === 'rpa-cx' && (u.status === 'Activo' || u.status === 'Desactivado')
    );
  } else if(role === 'admin-recuperadores') {
    this.dataSource = usuarios.filter(
      u => u.area === 'Recuperadores' && (u.status === 'Activo' || u.status === 'Desactivado')
    );
  } else if(role === 'admin-ajustesSucursales') {
    this.dataSource = usuarios.filter(
      u => u.area === 'Sucursales' && (u.status === 'Activo' || u.status === 'Desactivado')
    );
  } else {
    this.dataSource = [];
  }
}


}