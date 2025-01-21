import { INavbarData } from "./helper";

export const navData: INavbarData[]  = [
    {
        routerLink: 'mariana',
        icon: 'pi pi-th-large',
        Label: 'Dashboard',
        color: '#000',
        light: '#FFF',
        access: ['admin']
    },
    {
        routerLink: 'mariana/usuarios',
        icon: 'pi pi-cloud-upload',
        Label: 'Usuarios',
        color: '#000',
        light: '#FFF',
        access: ['admin']
    },
    // {
    //         routerLink: 'mariana/speech',
    //         icon: 'pi pi-th-large',
    //         Label: 'SpeechAnalytics',
    //         color: '#000',
    //         light: '#FFF',
    //         access: ['admin']
    // },
    {
        routerLink: 'mariana/cargar',
        icon: 'pi pi-cloud-upload',
        Label: 'Cargar Audios',
        color: '#000',
        light: '#FFF',
        access: ['admin'],

        items: [
            {
                routerLink: 'cargar/masiva',
                icon: 'pi pi-cloud-upload',
                Label: 'Masiva',
                color: '#000',
                light: '#FFF',
                access: ['admin']

            },
            {
                routerLink: 'cargar/individual',
                Label: 'Individual',
                icon: 'pi pi-cloud-upload',
                access: ['admin']


            }
        ]
    },
    {
        routerLink: 'mariana/analizar',
        icon: 'pi pi-search',
        Label: 'Analizar Audios',
        color: '#000',
        light: '#FFF',
        access: ['admin']

    },
    {
        icon: 'pi pi-user-edit',
        Label: 'Cargar Plantilla',
        color: '#000',
        routerLink: 'mariana/cargar-plantilla',
        light: '#FFF',
        access: ['admin']

    },
    {
        icon: 'pi pi-file',
        Label: 'Reporte',
        color: '#000',
        routerLink: 'mariana/generar',
        light: '#FFF',
        access: ['admin']

    },
    {
        routerLink: 'mariana/asignacion',
        icon: 'pi pi-slack',
        Label: 'Asignación Audios',
        color: '#000',
        light: '#FFF',
        access: ['analista','admin']

    },
    {
        routerLink: 'mariana/parametros',
        icon: 'pi pi-sliders-v',
        Label: 'Parámetros',
        color: '#000',
        light: '#FFF',
        access: ['admin'],
        items: [
            {
                routerLink: 'parametros',
                icon: 'pi pi-verified',
                Label: 'Guías de calidad',
                color: '#000',
                light: '#FFF',
                access: ['admin']

            },
            {
                routerLink: 'subcategorias',
                Label: 'Subcategorías',
                icon: 'pi pi-pencil',
                access: ['admin']
                
            }
        ]
    },
    {
        routerLink: 'mariana/programar',
        icon: 'pi pi-calendar',
        Label: 'Programar',
        color: '#000',
        light: '#FFF',
        access: ['admin']
    },
]