import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PermisoService {
  private baseUrl = `${environment.API_URL}User`;

  constructor(private http: HttpClient) {}

  obtenerPermisos(role: string): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/permisos/${role}`)
      .pipe(
        catchError(() => of([]))
      );
  }
}

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  model: any[] = [];
  menus: any[] = [
    {
      label: 'Cyber Room',
      key: "home",
      icon: 'pi pi-home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/home'],
        },
      ]
    },
    {
      label: 'Administracion',
      key: "administracion",
      icon: 'pi pi-fw pi-compass',
      items: [
        {
          label: 'Reportes',
          icon: 'pi pi-fw pi-book',
          routerLink: ['/administracion/reportes'],
        },
        {
          label: 'Reproceso',
          icon: 'pi pi-fw pi-sync',
          routerLink: ['/administracion/reporcesos'],
        },
        {
          label: 'Usuarios',
          icon: 'pi pi-fw pi-user',
          routerLink: ['/administracion/usuarios'],
        },
        {
          label: 'Roles',
          icon: 'pi pi-fw pi-copy',
          routerLink: ['/administracion/roles'],
        },
      ]
    },
    {
      label: 'Robots',
      key: "robots",
      icon: 'pi pi-fw pi-android',
      routerLink: ['/robots'],
      items: [
        {
          label: 'Actividad Robots',
          icon: 'pi pi-fw pi-play',
          routerLink: ['/robots/'],
        },
        {
          label: 'Crear nuevo Robot',
          icon: 'pi pi-fw pi-plus',
          routerLink: ['/robots/nuevo'],
        },
        {
          label: 'Actividad Procesos',
          icon: 'pi pi-fw pi-check-square',
          routerLink: ['/robots/proceso'],
        },
        {
          label: 'Crear nuevo Proceso',
          icon: 'pi pi-fw pi-plus',
          routerLink: ['/robots/proceso/nuevo'],
        },
      ]
    },
    {
      label: 'Extracción',
      key: "extraccion",
      items: [
        {
          label: 'Extracciones Manual',
          icon: 'pi pi-fw pi-external-link',
          routerLink: ['/extraccion'],
        },
        {
          label: 'Extracciones Automatizadas',
          icon: 'pi pi-fw pi-exclamation-triangle',
          routerLink: ['/extraccion/automatizados'],
        },
      ]
    },
    {
      label: 'Agencias Externas',
      key: "AgenciasExternas",
      items: [
        {
          label: 'Importar Base',
          icon: 'pi pi-fw pi-database',
          routerLink: ['/AgenciasExternas/CreacionCNs'],
        },
        {
          label: 'Pantalla Consulta',
          icon: 'pi pi-fw pi-search',
          routerLink: ['/AgenciasExternas/PantallaConsulta'],
        },
      ]
    },
    {
      label: 'ok-cliente',
      key: "okcliente",
      items: [
        {
          label: 'Importar Base',
          icon: 'pi pi-fw pi-database',
          routerLink: ['/okcliente/ImportarOkCliente'],
        },
        {
          label: 'Pantalla Consulta',
          icon: 'pi pi-fw pi-search',
          routerLink: ['/okcliente/ConsultaOKCliente'],
        },
      ]
    },
    {
      label: 'Ajustes',
      key: "ajustes",
      icon: 'pi pi-fw pi-compass',
      items: [
        {
          label: 'Con Validación',
          items: [
            {
              label: 'Importar Casos de Negocio Cobranza',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/ajustes'],
            },
            {
              label: 'Consulta registros de ajustes',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ajustes/consulta'],
            },
            {
              label: 'Parámetros',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/ajustes/parametros'],
            },
          ]
        },
        {
          label: 'Sin Validación',
          items: [
            {
              label: 'Importar Base sin Validación',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/ajustes/baseSinValidacion'],
            },
            {
              label: 'Consultar Base sin Validacion',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ajustes/consultaSinValidacion'],
            },
          ]
        },
      ]
    },
    {
      label: 'NotDone',
      key: "notDone",
      items: [
        {
          label: 'Con Validación',
          items: [
            {
              label: 'Importar Bases NotDone',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/notDone'],
            },
            {
              label: 'Consulta Registros NotDone',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/notDone/consulta'],
            },
            {
              label: 'Parámetros',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/notDone/parametros'],
            },
          ]
        },
        {
          label: 'Sin Validación',
          items: [
            {
              label: 'Cancelación Sin Validación',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/notDone/cancelacionSinValidacion'],
            },
            {
              label: 'Consulta Cancelación Sin Validación',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/notDone/consultaCancelacionSinValidacion'],
            },
            {
              label: 'Casos de Negocio Sin Validación',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/notDone/CasosNegocioSinValidacion'],
            },
            {
              label: 'Consulta Casos de Negocio Sin Validación',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/notDone/consultaCasosNegocioSinValidacion'],
            },
          ]
        },
        {
          label: 'Base Depurada NotDone',
          items: [
            {
              label: 'Importar NotDone',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/notDone/ImportarNotDone'],
            },
            {
              label: 'Archivos NotDone',
              icon: 'pi pi-fw pi-file-pdf',
              routerLink: ['/notDone/BasesNotDone'],
            },
          ]
        },
        {
          label: 'Flag de Confirmación',
          items: [
            {
              label: 'Importar Flag de Confirmación',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/notDone/flagConfirmacion'],
            },
            {
              label: 'Consultar Base flag de Confirmación',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/notDone/consultarFlagConfirmacion'],
            },
          ]
        },
        
      ]
    },
    {
      label: 'Depuración',
      key: "depuracion",
      icon: 'pi pi-fw pi-compass',
      items: [
        {
          label: 'Extracción',
          icon: 'pi pi-fw pi-external-link',
          routerLink: ['/depuracion'],
        },
        {
          label: 'Bases depuradas',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/depuracion/bases'],
        },
        {
          label: 'Bases Cancelación OS',
          icon: 'pi pi-fw pi-database',
          routerLink: ['/depuracion/basesCanceladas'],
        },
        {
          label: 'Pantalla Consulta',
          icon: 'pi pi-fw pi-search',
          routerLink: ['/depuracion/consulta'],
        },
        {
          label: 'Prefijos de Marcación',
          icon: 'pi pi-fw pi-phone',
          routerLink: ['/depuracion/prefijos'],
        },
        {
          label: 'Hobs a Depurar',
          icon: 'pi pi-fw pi-spinner',
          routerLink: ['/depuracion/HobsDepuracion'],
        },
        {
          label: 'Estado de Fallas Depuraion',
          icon: 'pi pi-fw pi-ban',
          routerLink: ['/depuracion/FallasDepuracion'],
        },
        {
          label: 'Repositorio de Archivos',
          icon: 'pi pi-fw pi-file-pdf',
          routerLink: ['/depuracion/Archivos-CC'],
        },
      ]
    },
    {
      label: 'Limpieza',
      key: "limpieza",
      icon: 'pi pi-fw pi-eraser',
      items: [
        {
          label: 'Limpieza Interna',
          icon: 'pi pi-fw pi-server',
          routerLink: ['/limpieza/series'],
        },
        {
          label: 'Limpieza Externa',
          icon: 'pi pi-fw pi-download',
          routerLink: ['/limpieza/limpieza-Externa'],
        },
        {
          label: 'Usuarios Bots',
          icon: 'pi pi-fw pi-user',
          routerLink: ['/limpieza/usuariosbots'],
        },
      ]
    },
    {
      label: 'Reporte Fidelización',
      key: "reporteFidelizacion",
      icon: 'pi pi-fw pi-compass',
      items: [
        {
          label: 'Reporte',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: ['/reporteFidelizacion'],
        },
      ]
    },
    {
      label: 'Ajustes, Cambios de Servicios y Retencion',
      key: "ajustesCambioServicioRetencion",
      icon: 'pi pi-fw pi-compass',
      items: [
        {
          label: 'Ajuste y Cambio de Servicios',
          items: [
            {
              label: 'Base de Datos Ajustes',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/ajustesCambioServicioRetencion/BDajustes'],
            },
            {
              label: 'Consulta Ajustes',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ajustesCambioServicioRetencion/consulta'],
            },
            {
              label: 'Migraciones Lineales',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/ajustesCambioServicioRetencion/migracionesLineales'],
            },
            {
              label: 'Consulta Migraciones Lineales',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ajustesCambioServicioRetencion/consultaMigracionesLineales'],
            },
          ],
        },
        {
          label: 'Retencion',
          items: [
            {
              label: 'Retencion 0',
              icon: 'pi pi-fw pi-chart-bar',
              routerLink: ['/ajustesCambioServicioRetencion/Retencion'],
            },
            {
              label: 'Consulta',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ajustesCambioServicioRetencion/consultaretencion'],
            },
          ],
        },
        {
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf',
          routerLink: ['/ajustesCambioServicioRetencion/Reportes'],
        },
        {
          label: 'Actividad',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/ajustesCambioServicioRetencion/actividad-rpa'],
        },
      ]
    },
    {
      label: 'Creación de OS',
      key: "ordenes",
      icon: 'pi pi-fw pi-compass',
      items: [
        {
          label: 'Creacion de Ordenes',
          items: [
            {
              label: 'Base Creación de Ordenes',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/ordenes/creacion-Orden'],
            },
            {
              label: 'Consulta Creación de Ordenes',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ordenes/consulta-creacion-Orden'],
            },
          ]
        },
        {
          label: 'Ordenes Call Trouble',
          items: [
            {
              label: 'Base Call Trouble',
              icon: 'pi pi-fw pi-database',
              routerLink: ['/ordenes/Ordenes-Call-Trouble'],
            },
            {
              label: 'Consulta Ordenes Call Trouble',
              icon: 'pi pi-fw pi-search',
              routerLink: ['/ordenes/Consulta-Ordenes-Call-Trouble'],
            },
          ]
        }
      ]
    },
  ];

  private allowedItemsMap: {
  [role: string]: { [menuKey: string]: number[] }
      } = {
        'admin-cx': {
          administracion: [0, 1, 2]
        },
        'admin-sucursales': {
          administracion: [0]
        },
        'admin-limpieza': {
          administracion: [0, 2]
        },
        'depuracion-cx': {
          administracion: [0]
        },
        'ajustes-cx': {
          administracion: [0]
        },
        'notDone-cx': {
          administracion: [0]
        },
        'extraccion-cx': {
          administracion: [0]
        },
        'ordenes-cx': {
          administracion: [0]
        },
        'okCliente-cx': {
          administracion: [0]
        },
      };


  constructor(private permisoService: PermisoService) {}

  ngOnInit() {
    const usuarioInfo = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = usuarioInfo?.role as string;
    if (!role) {
      this.model = [];
      return;
    }

    this.permisoService.obtenerPermisos(role).subscribe(permisos => {
      const autorizados = this.menus.filter(m => permisos.includes(m.key));

      this.model = autorizados.map(menu => {
        const items: any[] = menu.items || [];
        const allowedIdx = this.allowedItemsMap[role]?.[menu.key];
        let filtered: any[];

        if (Array.isArray(allowedIdx)) {
          filtered = items.filter((_, idx) => allowedIdx.includes(idx));
        } else {
          filtered = items;
        }

        return {
          ...menu,
          items: filtered.length ? filtered : undefined
        };
      })
      .filter(menu => !menu.items || menu.items.length > 0);
    });
  }
}