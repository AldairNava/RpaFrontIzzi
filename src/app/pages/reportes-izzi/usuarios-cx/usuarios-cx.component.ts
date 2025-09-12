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
        this.usuarios = data;
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
        this.rolesDisponibles = data.map(x => ({
          label: x.Name || x.name,
          value: x.Name || x.name
        }));
        // Prevención: agrega el rol actual si no viene en la lista
        if (
          this.editandoUsuario &&
          this.editandoUsuario.rol &&
          !this.rolesDisponibles.some(r => r.value === this.editandoUsuario!.rol)
        ) {
          this.rolesDisponibles.unshift({
            label: this.editandoUsuario.rol,
            value: this.editandoUsuario.rol
          });
        }
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
