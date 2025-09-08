import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  model: any[] = [

  ];
  menus: any[] = [
    {
      label: 'Cyber Room',
      key: "home",
      icon: 'pi pi-home',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/izzi-rpacx'],
        },
      ]
    },
    {
      label: 'Administacion',
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
          icon: 'pi pi-fw pi-tablet',
          routerLink: ['/robots/'],
        },
        {
          label: 'Crear nuevo Robot',
          icon: 'pi pi-fw pi-plus',
          routerLink: ['/robots/nuevo'],
        },
        {
          label: 'Actividad Procesos',
          icon: 'pi pi-fw pi-tablet',
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
      key: "okCliente",
      items: [
        {
          label: 'Importar Base',
          icon: 'pi pi-fw pi-database',
          routerLink: ['/okcliente/InportarOkCliente'],
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
        items:[
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
          // {
          //   label: 'Reprocesar',
          //   icon: 'pi pi-fw pi-sync',
          //   routerLink: ['/ajustes/reprocesar'],
          // },
        ]
      }, 
      {
		    label: 'Sin Validación',
        items:[
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
          // {
          //   label: 'Reprocesar Sin Validacion',
          //   icon: 'pi pi-fw pi-sync',
          //   routerLink: ['/ajustes/Reprocesarsinvalidacion'],
          // }
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
        items:[
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
            // {
            //   label: 'Reprocesar',
            //   icon: 'pi pi-fw pi-sync',
            //   routerLink: ['/notDone/reprocesarnotdone'],
            // }
        ]
      },
      {
		    label: 'Sin Validación',
        items:[
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
            label: 'Casos de Negocio Sin Validación ',
            icon: 'pi pi-fw pi-database',
            routerLink: ['/notDone/CasosNegocioSinValidacion'],
          },
          {
            label: 'Consulta Casos de Negocio Sin Validación ',
            icon: 'pi pi-fw pi-search',
            routerLink: ['/notDone/consultaCasosNegocioSinValidacion'],
          },
          // {
          //   label: 'Reprocesar Cancelacion Sin Validacion',
          //   icon: 'pi pi-fw pi-sync',
          //   routerLink: ['/notDone/reprocesarnotdonesinvalidacion'],
          // },
          // {
          //   label: 'Reprocesar Casos de Negocio Sin Validacion',
          //   icon: 'pi pi-fw pi-sync',
          //   routerLink: ['/notDone/reprocesarcasosnegociosinvalidacion'],
          // }
        ]
		  },
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
			label: 'Home',
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
                  items:[        
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
                        label:'Retencion',
                        items:[
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
                      ]
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
                    items:[      
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
                    items:[      
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

  ]
  ngOnInit() {


    let permisos: any = {
      "administrador":['extraccion','home','ajustes','notDone','depuracion','reporteFidelizacion','limpieza','administracion','ajustesCambioServicioRetencion','robots','ordenes','AgenciasExternas','okCliente'],
      "admin-ajustesSucursales":['home','ajustesCambioServicioRetencion','AgenciasExternas'],
      "admin-rpacx":['extraccion','home','ajustes','notDone','depuracion','administracion','robots','okCliente'],
      "admin-recuperadores":['home','limpieza','administracion','reporteFidelizacion','ordenes'],
      "Reporte":['home','reporteFidelizacion'],
      "Extraccion":['home','extraccion'],
      "Depuracion":['home','depuracion','administracion'],
      "Ajustes":['home','ajustesCambioServicioRetencion','administracion'],
      "AjustesNotDone":['home','notDone','administracion'],
      "testAjustes1":['home','ajustes','administracion'],
      "eBarrera":['extraccion','home','ajustes','notDone','depuracion','reporteFidelizacion','administracion','robots','okCliente'],
      "testReportes":['home','administracion'],
      "ACS":['home','ajustesCambioServicioRetencion'],
      "recuperadores":['home','limpieza','AgenciasExternas','administracion'],
    }
    this.model = [];
    let usuarioInfo = JSON.parse(localStorage.getItem("userData") || "{}")
    this.menus.forEach((elemento) => {


      // console.log(elemento)
      if (permisos[usuarioInfo?.role].includes(elemento.key)) {
        this.model.push(elemento)
      }
    })

  }
}
