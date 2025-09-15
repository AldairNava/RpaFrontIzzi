import { Component, OnInit } from '@angular/core';
import { CorsService } from '@services';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface UsuarioCx {
  id_users: number;
  username: string;
  email: string;
  active: boolean | number | null;
  name: string;
  rol: string;
  staff: string;
  area: string;
  departamento: string;
}

@Component({
  selector: 'usuarios-cx',
  templateUrl: './usuarios-cx.component.html',
  styleUrls: ['./usuarios-cx.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class UsuariosCXComponent implements OnInit {
  usuarios: UsuarioCx[] = [];
  loading: boolean = false;
  editandoUsuario: UsuarioCx | null = null;
  displayDialogEditar: boolean = false;
  rolesDisponibles: { label: string; value: string }[] = [];

  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
  this.loading = true;
  this.cors.get('User/getUsersCx')
    .then((data: UsuarioCx[]) => {
      const storedUser = sessionStorage.getItem('user');
      let usuarioLogueado: any = null;
      if (storedUser) {
        usuarioLogueado = JSON.parse(storedUser);
      }

      if (usuarioLogueado && usuarioLogueado.role) {
  const rol = usuarioLogueado.role;
  if (rol === 'administrador' || rol === 'Administrador') {
        this.usuarios = data;
      } else if (rol === 'admin-cx') {
        this.usuarios = data.filter(u =>
          (u.staff === 'cx' && u.departamento === 'cx') ||
          (u.staff === 'General' && u.departamento === 'General')
        );
      } else if (rol === 'admin-sucursales') {
        this.usuarios = data.filter(u =>
          (u.staff === 'cx' && u.departamento === 'sucursales') ||
          (u.staff === 'General' && u.departamento === 'General')
        );
      } else if (rol === 'admin-limpieza') {
        this.usuarios = data.filter(u =>
          (u.staff === 'cx' && u.departamento === 'limpieza') ||
          (u.staff === 'General' && u.departamento === 'General')
        );
      } else {
        this.usuarios = [];
      }
    } else {
      this.usuarios = [];
    }

      this.loading = false;
    })
    .catch((err: any) => {
      this.usuarios = [];
      this.loading = false;
    });
}


  cambiarEstadoUsuario(user: UsuarioCx, nuevoEstado: number) {
    this.loading = true;
    const payload = {
      id_users: user.id_users,
      user: user.username,
      email: user.email,
      pass: "",
      active: nuevoEstado,
      name: user.name,
      rol: user.rol,
      staff: user.staff,
      area: user.area,
      departamento: user.departamento
    };

    this.cors.put(`User/ActualizarUsuarioCx?id=${user.id_users}`, payload)
      .then(() => {
        user.active = nuevoEstado;
        this.loading = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: nuevoEstado === 1 ? 'Usuario activado correctamente.' : 'Usuario desactivado correctamente.',
        });
      })
      .catch((error: any) => {
        this.loading = false;
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al actualizar el usuario.',
        });
      });
  }

  abrirDialogEditar(user: UsuarioCx) {
    this.editandoUsuario = { ...user };
    this.displayDialogEditar = true;
    this.cargarRolesDisponibles();
  }

cargarRolesDisponibles() {
  this.cors.get('User/getRole')
    .then((data: any[]) => {
      const storedUser = sessionStorage.getItem('user');
      let usuarioLogueado: any = null;
      if (storedUser) {
        usuarioLogueado = JSON.parse(storedUser);
      }

      let rolesFiltrados = data;

      if (usuarioLogueado && usuarioLogueado.Role && usuarioLogueado.Role !== 'administrador') {
        if (usuarioLogueado.Role === 'admin-cx') {
          rolesFiltrados = data.filter(x => (x.departamento || '').toLowerCase() === 'cx');
        } else if (usuarioLogueado.Role === 'admin-sucursales') {
          rolesFiltrados = data.filter(x => (x.departamento || '').toLowerCase() === 'sucursales');
        } else if (usuarioLogueado.Role === 'admin-limpieza') {
          rolesFiltrados = data.filter(x => (x.departamento || '').toLowerCase() === 'limpieza');
        } else {
          rolesFiltrados = [];
        }
      }

      this.rolesDisponibles = rolesFiltrados.map(x => ({
        label: x.Name || x.name,
        value: x.Name || x.name
      }));
    });
}





  guardarUsuarioEditado() {
    if (!this.editandoUsuario) return;
    this.loading = true;

    const payload = {
      id_users: this.editandoUsuario.id_users,
      user: this.editandoUsuario.username,
      email: this.editandoUsuario.email,
      pass: "",
      active: this.editandoUsuario.active === true ? 1 :
              this.editandoUsuario.active === false ? 0 : this.editandoUsuario.active,
      name: this.editandoUsuario.name,
      rol: this.editandoUsuario.rol,
      staff: this.editandoUsuario.staff,
      area: this.editandoUsuario.area,
      departamento: this.editandoUsuario.departamento
    };

    this.cors.put(`User/ActualizarUsuarioCx?id=${this.editandoUsuario.id_users}`, payload)
      .then(() => {
        const idx = this.usuarios.findIndex(u => u.id_users === this.editandoUsuario!.id_users);
        if (idx > -1) this.usuarios[idx] = { ...this.editandoUsuario! };
        this.loading = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario actualizado correctamente.',
        });
        this.displayDialogEditar = false;
      })
      .catch(() => {
        this.loading = false;
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al actualizar el usuario.',
        });
      });
  }
}
