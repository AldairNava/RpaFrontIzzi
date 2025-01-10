import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';



import { DarkService } from '../../../services/darkmode/dark.service';
import { CorsService } from '../../../services/cors/cors.service';

import Swal from 'sweetalert2';

interface categorias {
  name: string;
  id: number;
}


@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
  providers: [MessageService]
})


export class ParametrosComponent implements OnInit {

    columnasDB: any[] = ['Nombre punto', 'Contexto', 'Puntaje', 'Subcategoría'];
    rowsDB: any[] = [];

    tipo: { name: string }[] = [
        { name: 'Servicios' },
        { name: 'Soporte' },
        { name: 'Televentas' },
        { name: 'Cobranza' },
        { name: 'Retenciones' }
    ];

    tipoSelected: any;
    row = [{'1': '1'}];

    nuevasFilas: any = [

    ];

    categoria: categorias[] | undefined;

    selectedCategoria: categorias | undefined;


    mode: boolean = false;

    crearV: boolean = false;
    nombreGuia: string = '';
    nombreGuiones: string = '';
    nombrePuntoGuiones: string = '';
    guiasDb: any[] = [];
    ableBtnFila: boolean = false;
    nombreTablaCalificaciones: string = '';

    nuevaGuiaForm: FormGroup;

    procesos = [
        { name: 'Servicios'},
        { name: 'Soporte'},
        { name: 'Televentas'},
        { name: 'Cobranza'},
        { name: 'Retenciones'}
    ];



  constructor(private cors: CorsService,
              private messageService: MessageService,
              private router: Router,
              private dark: DarkService,
              private formBuilder: FormBuilder  
              ) 
            {
                this.nuevaGuiaForm = this.formBuilder.group({
                    nombreGuia: ['',Validators.required],
                    nombreTabla: [''],
                    proceso: ['',Validators.required],
                    tipo: ['',Validators.required]
                  })
            }

    ngOnInit() {
        this.darkModeSubscription();
        this.obtenerSubcat();

        this.categoria = [ ];


    }

    obtenerSubcat() {
        const data = {
            controlador: 'parametrosController',
            metodo: 'selectSubcat'
        }
        this.cors.post(data).subscribe(
          (res: any) => {
            if(res.status) {
                this.categoria = res.row;
            }
          },
          (err: any) => {
            console.log(err)
          }
        )
      }

      getAllGuias() {
        const data = {
            controlador: 'parametrosController',
            metodo: 'getGuias',
            tipo: this.tipoSelected.name
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                if(res.status) {
                    const guias = res.rows

                    this.guiasDb = [];

                    guias.forEach((guia: any) => {

                        let data = {
                            nombre_guia: guia.nombre_guia,
                            tabla: guia.nombre_tabla,
                            rowsDB: ''
                        }
                        this.guiasDb.push(data);
                    });

                    this.getRowsDinamico(guias);

                } else {
                    this.guiasDb = [];
                    this.showMessage('warn', 'Aviso', `No se han encontrado guías para mostrar`);
                }
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    getRowsDinamico(guias: any) {
        guias.forEach((guia:any, index: number) => {
            const data = {
                controlador: 'ParametrosController',
                metodo: 'getRowsDinamico',
                tabla: guia.nombre_tabla
            }
            this.cors.post(data).subscribe(
                (res:any) => {
                    if(res.status) {
                        if(this.guiasDb[index].tabla === guia.nombre_tabla ) {
                            this.guiasDb[index].rowsDB = res.rows;
                        }
                    }
                },
                (err:any) => {
                    console.log(err)
                }
            )
        });

    }


    addNewDatos(guia: any) {
        const filasActuales = guia.rowsDB;
        let posicion: number = 0;

        const nombre_tabla = guia.tabla;
        const iteraciones: number = this.nuevasFilas.length;
        let controlIteraciones: number = 0;
        let nombreNuevoPunto = '';
        let referenciaAfter = '';

        this.nuevasFilas.forEach((fila: any) => {
            this.nombrePuntoGuiones = '';

            let nombrePunto: any[] = [];
            nombrePunto = fila.nombre_punto.split(' ');
    
            nombrePunto.forEach((palabra: any) => {
                if(this.nombrePuntoGuiones === '') {
                    this.nombrePuntoGuiones = palabra;
                } else {
                    this.nombrePuntoGuiones = this.nombrePuntoGuiones + '_' + palabra;
                }
            });

            fila.id_subcategoria = fila.id_subcategoriaSelect.id_subcategorias;
            fila.nombre_tabla = nombre_tabla
            fila.nombre_punto = this.nombrePuntoGuiones;
        });
        
        if(controlIteraciones != iteraciones) {
            this.nuevasFilas.forEach((nueva: any) => {
                filasActuales.forEach((actual: any, index: number) => {
                    if( nueva.id_subcategoria === actual.id_subcategoria ) {
                        posicion = index;
                    }
                })
    
                nueva.ref = posicion;

                referenciaAfter = filasActuales[posicion].nombre_punto;
                nombreNuevoPunto = this.nuevasFilas[0].nombre_punto;
            })
    
            this.nuevasFilas.forEach((nueva: any) => {
                filasActuales.splice(nueva.ref + 1, 0, nueva);
            })

            controlIteraciones++;

        }

        let tablaC = `calificaciones_${nombre_tabla}`;

        const data = {
            controlador: 'ParametrosController',
            metodo: 'addRow',
            nombre_tabla,
            filas: filasActuales,
            tablaC,
            referenciaAfter,
            nombreNuevoPunto
        };



        this.cors.post(data).subscribe(
            (res:any) => {
                if(res.status) {
                    this.showMessage('success', 'Fantástico', `Se han añadido nuevos parámetros`);
                    this.nuevasFilas = [];
                    setTimeout(() => {
                        const currentUrl = this.router.url;
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                            this.router.navigate([currentUrl]);
                        });
                    }, 1000);
                }
            },
            (err:any) => {
                console.log(err);
                this.showMessage('warn', 'Aviso', 'Por favor revisa los datos introducidos');

            }
        )
    }

    deleteRow(guia: any, row: any) {
        const tabla = guia.tabla;
        const nombre_punto = row.nombre_punto;

        const data = {
            controlador: 'ParametrosController',
            metodo: 'deleteRow',
            tabla: tabla,
            nombre_punto: nombre_punto
        }


        this.cors.post(data).subscribe(
            (res:any) => {
                if(res.status) {
                    this.showMessage('success', 'Fantástico', `Se ha eliminado el parámetro ${nombre_punto}`);
                    setTimeout(() => {
                        const currentUrl = this.router.url;
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                            this.router.navigate([currentUrl]);
                        });
                    }, 1000);
                }
            },
            (err:any) => {
                console.log(err);
            }
        )
    }


    borrarGuia(guia: any) {
        console.log(guia)
        const tabla  = guia.tabla;
        const nombre = guia.nombre_guia;
        const tablaC = `calificaciones_${tabla}`

        Swal.fire({
            title: `¿Desea eliminar la guía: ${nombre}?`,
            showDenyButton: true,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`
          }).then((result) => {
            if (result.isConfirmed) {

                const data = {
                    controlador: 'parametrosController',
                    metodo: 'borrarTablaGuia',
                    'tabla': tabla,
                    'tablaC': tablaC
                }

            this.cors.post(data).subscribe(
                (res: any) => {
                    if(res.status) {
                        this.showMessage('success', 'Fantástico', `Se han eliminado la guia ${tabla}`);
                        this.guiasDb = [];
                        this.getAllGuias();
                    }
                },
                (err: any) => {
                    console.log(err)
                }
        )
            }
          });


    }

    guardarGuia() {
        console.log('Guardando guia')
        if( this.nuevaGuiaForm.valid ) {
            let nombreArray = [];
            nombreArray = this.nuevaGuiaForm.value.nombreGuia.split(' ');

            nombreArray.forEach((palabra: any) => {
                if(this.nombreGuiones === '') {
                    this.nombreGuiones = palabra;
                } else {
                    this.nombreGuiones = this.nombreGuiones + '_' + palabra;
                }
            });

            this.nuevaGuiaForm.value.nombreTabla = this.nombreGuiones.toLowerCase();

            this.nuevaGuiaForm.value.proceso = this.nuevaGuiaForm.value.proceso.toUpperCase();

            this.nuevaGuiaForm.value.tipo = this.nuevaGuiaForm.value.tipo.name.toLowerCase();

            this.enviarGuia();

        } else {
            this.showMessage('warn', 'Aviso', 'Por favor llena todos los campos');

        }
    }

    enviarGuia() {
        console.log('enviar guia')
        console.log(this.nuevaGuiaForm.value)
        // 'parametrosController/guardarGuia'
        this.cors.post(this.nuevaGuiaForm.value).subscribe(
            (res: any) => {
                if(res.status) {
                    this.crearTablaGuia();
                }
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    

    crearTablaGuia() {
        console.log('crear tabla guia')
        // 'parametrosController/crearTablaGuia', 
        this.cors.post(this.nuevaGuiaForm.value).subscribe(
            (res: any) => {
                if(res.status) {
                    this.crearV = false;
                    this.insertDefault();
                }
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    insertDefault() {
        console.log('insert default')
// 'parametrosController/insertDefault', 
        this.cors.post(this.nuevaGuiaForm.value).subscribe(
            (res: any) => {
                if(res.status) {
                    this.crearTablaCalificaciones();
                }
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    crearTablaCalificaciones() {
        console.log('crear tabla calificaciones')
// 'parametrosController/crearTablaCalificaciones', 
        this.cors.post(this.nuevaGuiaForm.value).subscribe(
            (res: any) => {
                if(res.status) {
                    console.log(res)
                    this.nombreGuia = '';
                    this.nombreGuiones = '';
                    this.showMessage('success', 'Fantástico', `Se ha creado la nueva guía`);
                    this.guiasDb = [];
                    this.getAllGuias();
                }
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    agregarFila() {
        if(this.nuevasFilas.length === 0) {
            this.ableBtnFila = true;
        
            this.nuevasFilas.push({
                nombre_punto: '',
                puntaje: null,
                id_subcategoriaSelect: null,
                contexto: '',
                nombre_tabla: '',
                ref: 0
            });
        } else {
            this.showMessage('warn', 'Aviso', 'Por favor añade la fila actual antes de crear otra');
        }

        document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }

    showMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({ severity: severity, summary: summary, detail: detail });
        // severity = logo, summary = Encaebzado, detail = Mensaje
    }

    private darkModeSubscription(): void {
        this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
        this.mode = isDarkModeEnabled;
        //   console.log('Modo oscuro cambiado:', this.mode);
        });
    }

}
