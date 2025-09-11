// Importaciones actualizadas
import { Component, OnInit } from '@angular/core';
import { CorsService } from '@services';
import { MessageService, ConfirmationService } from 'primeng/api';

export interface Role {
  name: string;
  status: number;
  area: string;
  departamento: string;
  staff: string;
}

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  permisosGlobales: string[] = [];
  permisosAsignados = new Set<string>();
  permisosParaEliminar = new Set<string>();

  // Campos para crear/editar
  newRoleName = '';
  newArea = '';
  newDepartamento = '';
  newStaff = '';
  newPermiso = { key: '', area: '', departamento: '', staff: '' };

  selectedRole: string | null = null;
  loading = false;
  displayDialog = false;
  displayEditDialog = false;
  displayAddPermisoDialog = false;
  displayEliminarDialog = false;
  displayConfirmDeleteRole = false;
  roleToDelete: string | null = null;

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.recargar();
  }

  /**
   * Recarga roles y permisos globales
   */
  recargar() {
    this.loading = true;
    // Obtener roles
    this.cors.get('User/roles')
      .then((res: Role[]) => this.roles = res)
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles.' }))
      .finally(() => this.loading = false);

    // Obtener permisos globales
    this.cors.get('User/permisos')
      .then((res: string[]) => this.permisosGlobales = res)
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los permisos globales.' }));
  }

  onAgregarRole() {
    this.selectedRole = null;
    this.newRoleName = '';
    this.newArea = '';
    this.newDepartamento = '';
    this.newStaff = '';
    this.permisosAsignados.clear();
    this.displayDialog = true;
  }
  onEditarRole(role: Role) {
    this.selectedRole = role.name;
    this.newRoleName = role.name;
    this.newArea = role.area;
    this.newDepartamento = role.departamento;
    this.newStaff = role.staff;
    // Cargar permisos existentes
    this.permisosAsignados.clear();
    this.loading = true;
    this.cors.get(`User/permisos/${encodeURIComponent(role.name)}`)
      .then((perms: string[]) => perms.forEach(p => this.permisosAsignados.add(p)))
      .catch(() => this.messageService.add({
         severity:'error', summary:'Error',
         detail:'No se pudieron cargar los permisos del rol.'
      }))
      .finally(() => {
        this.loading = false;
        this.displayEditDialog = true;
      });
  }

  onAgregarPermiso(): void {
    this.newPermiso = { key: '', area: '', departamento: '', staff: '' };
    this.displayAddPermisoDialog = true;
  }

  confirmarAgregarPermiso() {
    this.loading = true;
    const payload = {
      key_permiso: this.newPermiso.key,
      area: this.newPermiso.area,
      departamento: this.newPermiso.departamento,
      staff: this.newPermiso.staff
    };
    this.cors.post('User/permisos', payload)
      .then((resp: any) => {
        this.messageService.add({ severity: 'success', summary: 'Permiso creado', detail: resp?.message || `Permiso "${payload.key_permiso}" creado.` });
        this.displayAddPermisoDialog = false;
        this.recargar();
      })
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Error al crear permiso.' }))
      .finally(() => this.loading = false);
  }
  guardarEdicion() {
    if (!this.selectedRole) return;
    const basicDto = {
      Role: this.selectedRole,
      NewRole: this.newRoleName.trim(),
      Area: this.newArea.trim(),
      Departamento: this.newDepartamento.trim(),
      Staff: this.newStaff.trim()
    };

    this.loading = true;
    // 1) Actualizar datos básicos
    this.cors.put('User/actualizarRole', basicDto)
      .then((resp: any) => {
        // 2) Asignar permisos
        return this.cors.put('User/AsignarPermisos', {
          Role: basicDto.NewRole,
          permisos: Array.from(this.permisosAsignados)
        });
      })
      .then(() => {
        this.messageService.add({
          severity:'success', summary:'Rol actualizado',
          detail: `Datos y permisos de "${basicDto.NewRole}" actualizados.`
        });
        this.displayEditDialog = false;
        this.recargar();
      })
      .catch(err => this.messageService.add({
        severity:'error', summary:'Error',
        detail: err?.error?.message || 'Error al guardar los cambios.'
      }))
      .finally(() => this.loading = false);
  }


  onRoleSelect(roleName: string) {
    this.selectedRole = roleName;
    this.newRoleName = roleName;
    const rol = this.roles.find(r => r.name === roleName);
    if (rol) {
      this.newArea = rol.area;
      this.newDepartamento = rol.departamento;
      this.newStaff = rol.staff;
    }
    this.permisosAsignados.clear();
    this.loading = true;
    this.cors.get(`User/permisos/${encodeURIComponent(roleName)}`)
      .then((perms: string[]) => perms.forEach(p => this.permisosAsignados.add(p)))
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los permisos del rol.' }))
      .finally(() => {
        this.loading = false;
        this.displayDialog = true;
      });
  }

  togglePermiso(key: string, checked: boolean) {
    checked ? this.permisosAsignados.add(key) : this.permisosAsignados.delete(key);
  }

  guardarCambios() {
    const role = this.newRoleName.trim();
    if (!role) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre del rol no puede quedar vacío.' });
      return;
    }
    this.loading = true;
    const dto = { role, area: this.newArea.trim(), departamento: this.newDepartamento.trim(), staff: this.newStaff.trim() };
    const promRole = this.selectedRole
      ? Promise.resolve(null)
      : this.cors.post('User/roles', dto);

    promRole
      .then(() => this.cors.put('User/AsignarPermisos', { Role: role, permisos: Array.from(this.permisosAsignados) }))
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.selectedRole ? 'Permisos actualizados.' : `Rol "${role}" creado.` });
        this.displayDialog = false;
        this.recargar();
      })
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Error al guardar cambios.' }))
      .finally(() => this.loading = false);
  }

  onEliminarRole(roleName: string) {
    this.roleToDelete = roleName;
    this.displayConfirmDeleteRole = true;
  }

  confirmarEliminarRole() {
    if (!this.roleToDelete) return;
    this.loading = true;
    this.cors.delete(`User/roles/${encodeURIComponent(this.roleToDelete)}`)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Rol eliminado', detail: `Rol "${this.roleToDelete}" eliminado.` });
        this.recargar();
      })
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Error al eliminar el rol.' }))
      .finally(() => {
        this.loading = false;
        this.displayConfirmDeleteRole = false;
        this.roleToDelete = null;
      });
  }

  onEliminarPermiso() {
    this.permisosParaEliminar.clear();
    this.displayEliminarDialog = true;
  }

  togglePermisoEliminar(key: string, checked: boolean) {
    checked ? this.permisosParaEliminar.add(key) : this.permisosParaEliminar.delete(key);
  }

  confirmarEliminarPermisos() {
    this.loading = true;
    const promises = Array.from(this.permisosParaEliminar).map(key =>
      this.cors.delete(`User/permisos/${encodeURIComponent(key)}`)
        .catch(() => null)
    );
    Promise.all(promises)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Permisos eliminados', detail: 'Permisos seleccionados eliminados.' });
        this.displayEliminarDialog = false;
        this.recargar();
      })
      .finally(() => this.loading = false);
  }
  cancelarEliminarRole() {
    this.displayConfirmDeleteRole = false;
    this.roleToDelete = null;
  }

  onActivarRole(roleName: string): void {
    const rol = this.roles.find(r => r.name === roleName);
    if (!rol || rol.status === 1) return;
    this.loading = true;
    this.cors.put(`User/roles/${encodeURIComponent(roleName)}/status?active=true`, null)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Rol activado', detail: `Rol "${roleName}" activado.` });
        this.recargar();
      })
      .catch(err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Error al activar el rol.' }))
      .finally(() => this.loading = false);
  }
}
