import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '@services';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
moment.lang('es');
import { PrimeNGConfig } from 'primeng/api';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(es);

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('barChart') barChart: any;
    fechas:any=[];
    primerDia = moment().startOf('month');
    ultimoDia = moment().endOf('month');
    fechasForm:UntypedFormGroup;
    loading: boolean = false
    load: boolean = false
    basicDataEXT: any;
    isAdmin: boolean = false;
    isAdmin2: boolean = false;
    isUser: boolean = false;
    firstName: string = '';
    lastName: string = '';
    basicOptionsEXT: any;
    basicDataExtArray:any={
        graf:[],
        esta:[],
        val:[],
        motivo:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataCC: any;
    basicOptionsCC: any;
    basicDataCCArray:any={
        graf:[],
        esta:[],
        val:[],
        motivo:[],
        mes:[],
        dia:[],
        status:[],
        tipo:[],
    };
    basicDataAjustesConValidacion: any;
    basicOptionsAjustesConValidacion: any;
    basicDataAjustesConValidacionArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataAjustesSinValidacion: any;
    basicOptionsAjustesSinValidacion: any;
    basicDataAjustesSinValidacionArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataNotDone: any;
    basicOptionsNotDone: any;
    basicDataNotDoneArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataNotDoneGenracionCN: any;
    basicOptionsNotDoneGenracionCN: any;
    basicDataNotDoneGenracionCNArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataNotCancelacion: any;
    basicOptionsNotCancelacion: any;
    basicDataNotCancelacionArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataNotCreacionOrdenes: any;
    basicOptionsNotCreacionOrdenes: any;
    basicDataNotCreacionOrdenesArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    basicDataCallTrouble: any;
    basicOptionsCallTrouble: any;
    basicDataCallTroubleArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };

    basicDataOkCliente: any;
    basicOptionsOkCliente: any;
    basicDataOkClienteArray:any={
        graf:[],
        esta:[],
        val:[],
        categoria:[],
        solucion:[],
        mes:[],
        dia:[],
        status:[],
    };
    setStyle=['A','B','C','D','E','F','G']
    activeTabIndex: number = 0;

    constructor(private el: ElementRef,private cors: CorsService,private formBuilder: UntypedFormBuilder,private primengConfig: PrimeNGConfig,private messageService: MessageService,) {
        this.primengConfig.setTranslation({
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Limpiar'
        });
        this.fechasForm = this.formBuilder.group({
            fechas: [null],
        });
        this.fechas[0]=moment(this.primerDia).format('LL');
        this.fechas[1]=moment(this.ultimoDia).format('LL');
        this.load=true;
        this.buscarStatsEXT(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsCC(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsAjustesConValidacion(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsAjustesSinValidacion(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsNotDone(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsNotDoneGeneracionCN(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsNotCancelacion(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsNotCreacionOrdenes(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsCallTrouble(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
        this.buscarStatsOkCliente(this.primerDia.format('YYYY-MM-DD'),this.ultimoDia.format('YYYY-MM-DD'));
    }

    ngOnInit() {

        setInterval(() => {
            this.buscarStatsTodos();
        }, 300000);   
        
        const user = JSON.parse(localStorage.getItem('userData') || '{}');
        this.isAdmin = ['administrador', 'admin-rpacx'].includes(user?.role);
        this.isAdmin2 = user?.role === 'admin-ajustesSucursales';
        this.isUser = !this.isAdmin && !this.isAdmin2;
        this.firstName = user?.firstName || '';
        this.lastName = user?.lastName || '';

    }
    
    buscarStatsTodos(){
        this.load=true;
        let ini:any;
        let fin:any;
        this.load=true;
        if(this.fechasForm.controls['fechas'].value == null || this.fechasForm.controls['fechas'].value[1] == null){
            ini =this.primerDia.format('YYYY-MM-DD');
            fin =this.ultimoDia.format('YYYY-MM-DD');
        }else{
            ini =moment(this.fechasForm.controls['fechas'].value[0]).format('YYYY-MM-DD');
            fin =moment(this.fechasForm.controls['fechas'].value[1]).format('YYYY-MM-DD');
            
        }
        this.fechas[0]=moment(ini).format('LL');
        this.fechas[1]=moment(fin).format('LL');

        this.buscarStatsEXT(ini,fin);
        this.buscarStatsCC(ini,fin);
        this.buscarStatsAjustesConValidacion(ini,fin);
        this.buscarStatsAjustesSinValidacion(ini,fin);
        this.buscarStatsNotDone(ini,fin);
        this.buscarStatsNotDoneGeneracionCN(ini,fin);
        this.buscarStatsNotCancelacion(ini,fin);
        this.buscarStatsNotCreacionOrdenes(ini,fin);
        this.buscarStatsCallTrouble(ini,fin);
        this.buscarStatsOkCliente(ini,fin);
    }
    buscarStatsEXT(ini:any,fin:any){
        this.basicDataExtArray={
            graf:[],
            esta:[],
            val:[],
            motivo:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsEXT = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.cors.get('Estadisticas/estadisticasEXT',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
 
            
                // console.log(response);
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataExtArray.graf.push(key)
                        this.basicDataExtArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataExtArray.graf.push(key)
                        this.basicDataExtArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataExtArray.graf.push(key)
                        this.basicDataExtArray.esta.push(value)
                      }
                      if(key=='registroExitoso'){
                        this.basicDataExtArray.graf.push(key)
                        this.basicDataExtArray.esta.push(value)
                      }
                      if(key=='ordenCancelada'){
                        this.basicDataExtArray.graf.push(key)
                        this.basicDataExtArray.esta.push(value)
                      }
                    });
                });
                this.basicDataExtArray.val=response[0].grafica
                this.basicDataExtArray.motivo=response[0].motivo
                this.basicDataExtArray.mes=response[0].mes
                this.basicDataExtArray.dia=response[0].dia
                this.basicDataExtArray.dia[this.basicDataExtArray.dia.length-1].base='Total'
                this.basicDataExtArray.status=response[0].status
                this.basicDataExtArray.ip=response[0].ip

                // console.log(this.basicDataExtArray)
               

                this.basicDataEXT = {
                    // labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    labels: this.basicDataExtArray.graf,
                    datasets: [
                        {
                            label: 'Depuracion EXT',
                            data: this.basicDataExtArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron los registros para EXT',
                detail: 'Intenta Nuevamente!!!',
              });
        })
        



    }
    buscarStatsCC(ini:any,fin:any){
        this.basicDataCCArray={
            graf:[],
            esta:[],
            val:[],
            motivo:[],
            mes:[],
            dia:[],
            status:[],
            tipo:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsCC = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.cors.get('Estadisticas/estadisticasCC',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
 
            
                // console.log(response);
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataCCArray.graf.push(key)
                        this.basicDataCCArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataCCArray.graf.push(key)
                        this.basicDataCCArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataCCArray.graf.push(key)
                        this.basicDataCCArray.esta.push(value)
                      }
                      if(key=='registroExitoso'){
                        this.basicDataCCArray.graf.push(key)
                        this.basicDataCCArray.esta.push(value)
                      }
                      if(key=='ordenCancelada'){
                        this.basicDataCCArray.graf.push(key)
                        this.basicDataCCArray.esta.push(value)
                      }
                    });
                });
                this.basicDataCCArray.val=response[0].grafica
                this.basicDataCCArray.motivo=response[0].motivo
                this.basicDataCCArray.mes=response[0].mes
                this.basicDataCCArray.dia=response[0].dia
                this.basicDataCCArray.dia[this.basicDataCCArray.dia.length-1].base='Total'
                this.basicDataCCArray.status=response[0].status
                this.basicDataCCArray.ip=response[0].ip
                this.basicDataCCArray.tipo=response[0].tipo
            //    console.log(this.basicDataCCArray)

                this.basicDataCC = {
                    // labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    labels: this.basicDataCCArray.graf,
                    datasets: [
                        {
                            label: 'Depuracion CC',
                            data: this.basicDataCCArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron los registros para CC',
                detail: 'Intenta Nuevamente!!!',
              });
        })
        



    }
    buscarStatsAjustesConValidacion(ini:any,fin:any){
        this.basicDataAjustesConValidacionArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsAjustesConValidacion = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.cors.get('Estadisticas/estadisticasAjustesConValidacion',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
 
            
                // console.log(response);
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataAjustesConValidacionArray.graf.push(key)
                        this.basicDataAjustesConValidacionArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataAjustesConValidacionArray.graf.push(key)
                        this.basicDataAjustesConValidacionArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataAjustesConValidacionArray.graf.push(key)
                        this.basicDataAjustesConValidacionArray.esta.push(value)
                      }
                      if(key=='ajusteRealizado'){
                        this.basicDataAjustesConValidacionArray.graf.push(key)
                        this.basicDataAjustesConValidacionArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataAjustesConValidacionArray.graf.push(key)
                        this.basicDataAjustesConValidacionArray.esta.push(value)
                      }
                    });
                });
                this.basicDataAjustesConValidacionArray.val=response[0].grafica
                this.basicDataAjustesConValidacionArray.categoria=response[0].categoria
                this.basicDataAjustesConValidacionArray.solucion=response[0].solucion
                this.basicDataAjustesConValidacionArray.mes=response[0].mes
                this.basicDataAjustesConValidacionArray.dia=response[0].dia
                this.basicDataAjustesConValidacionArray.dia[this.basicDataAjustesConValidacionArray.dia.length-1].base='Total'
                this.basicDataAjustesConValidacionArray.status=response[0].status
                this.basicDataAjustesConValidacionArray.ip=response[0].ip
               
                // console.log(this.basicDataAjustesConValidacionArray)
                this.basicDataAjustesConValidacion = {
                    // labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    labels: this.basicDataAjustesConValidacionArray.graf,
                    datasets: [
                        {
                            label: 'Ajustes con Validación',
                            data: this.basicDataAjustesConValidacionArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
                this.load=false;
                this.fechasForm.controls['fechas'].patchValue(null);        
        
        
            }
        }).catch((error) => {
            console.log(error)
            this.load=false;
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para Ajustes con validación',
                detail: 'Intenta Nuevamente!!!',
              });
            
        })
        



    }
    buscarStatsAjustesSinValidacion(ini:any,fin:any){
        this.basicDataAjustesSinValidacionArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsAjustesSinValidacion = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.cors.get('Estadisticas/estadisticasAjustesSinValidacion',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataAjustesSinValidacionArray.graf.push(key)
                        this.basicDataAjustesSinValidacionArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataAjustesSinValidacionArray.graf.push(key)
                        this.basicDataAjustesSinValidacionArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataAjustesSinValidacionArray.graf.push(key)
                        this.basicDataAjustesSinValidacionArray.esta.push(value)
                      }
                      if(key=='ajusteRealizado'){
                        this.basicDataAjustesSinValidacionArray.graf.push(key)
                        this.basicDataAjustesSinValidacionArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataAjustesSinValidacionArray.graf.push(key)
                        this.basicDataAjustesSinValidacionArray.esta.push(value)
                      }
                    });
                });
                this.basicDataAjustesSinValidacionArray.val=response[0].grafica
                this.basicDataAjustesSinValidacionArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataAjustesSinValidacionArray.solucion=response[0].solucion
                this.basicDataAjustesSinValidacionArray.mes=response[0].mes
                this.basicDataAjustesSinValidacionArray.dia=response[0].dia
                this.basicDataAjustesSinValidacionArray.dia[this.basicDataAjustesSinValidacionArray.dia.length-1].base='Total'
                this.basicDataAjustesSinValidacionArray.status=response[0].status
                this.basicDataAjustesSinValidacionArray.ip=response[0].ip
               
                // console.log(this.basicDataAjustesSinValidacionArray)
                this.basicDataAjustesSinValidacion = {
                    // labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    labels: this.basicDataAjustesSinValidacionArray.graf,
                    datasets: [
                        {
                            label: 'Ajustes sin Validación',
                            data: this.basicDataAjustesSinValidacionArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para Ajustes sin validción',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }
    buscarStatsNotDone(ini:any,fin:any){
        this.basicDataNotDoneArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsNotDone = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        this.cors.get('Estadisticas/estadisticasNotDone',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataNotDoneArray.graf.push(key)
                        this.basicDataNotDoneArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataNotDoneArray.graf.push(key)
                        this.basicDataNotDoneArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataNotDoneArray.graf.push(key)
                        this.basicDataNotDoneArray.esta.push(value)
                      }
                      if(key=='completado'){
                        this.basicDataNotDoneArray.graf.push(key)
                        this.basicDataNotDoneArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataNotDoneArray.graf.push(key)
                        this.basicDataNotDoneArray.esta.push(value)
                      }
                    });
                });
                this.basicDataNotDoneArray.val=response[0].grafica
                this.basicDataNotDoneArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataNotDoneArray.solucion=response[0].solucion
                this.basicDataNotDoneArray.mes=response[0].mes
                this.basicDataNotDoneArray.dia=response[0].dia
                this.basicDataNotDoneArray.dia[this.basicDataNotDoneArray.dia.length-1].base='Total'
                this.basicDataNotDoneArray.status=response[0].status
                this.basicDataNotDoneArray.ip=response[0].ip
                this.basicDataNotDone = {
                    labels: this.basicDataNotDoneArray.graf,
                    datasets: [
                        {
                            label: 'NotDone',
                            data: this.basicDataNotDoneArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para NotDone',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }
    buscarStatsNotDoneGeneracionCN(ini:any,fin:any){
        this.basicDataNotDoneGenracionCNArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsNotDoneGenracionCN = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        this.cors.get('Estadisticas/estadisticasNotDoneGeneracionCN',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataNotDoneGenracionCNArray.graf.push(key)
                        this.basicDataNotDoneGenracionCNArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataNotDoneGenracionCNArray.graf.push(key)
                        this.basicDataNotDoneGenracionCNArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataNotDoneGenracionCNArray.graf.push(key)
                        this.basicDataNotDoneGenracionCNArray.esta.push(value)
                      }
                      if(key=='completado'){
                        this.basicDataNotDoneGenracionCNArray.graf.push(key)
                        this.basicDataNotDoneGenracionCNArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataNotDoneGenracionCNArray.graf.push(key)
                        this.basicDataNotDoneGenracionCNArray.esta.push(value)
                      }
                    });
                });
                this.basicDataNotDoneGenracionCNArray.val=response[0].grafica
                this.basicDataNotDoneGenracionCNArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataNotDoneGenracionCNArray.solucion=response[0].solucion
                this.basicDataNotDoneGenracionCNArray.mes=response[0].mes
                this.basicDataNotDoneGenracionCNArray.dia=response[0].dia
                this.basicDataNotDoneGenracionCNArray.dia[this.basicDataNotDoneGenracionCNArray.dia.length-1].base='Total'
                this.basicDataNotDoneGenracionCNArray.status=response[0].status
                this.basicDataNotDoneGenracionCNArray.ip=response[0].ip
                this.basicDataNotDoneGenracionCN = {
                    labels: this.basicDataNotDoneGenracionCNArray.graf,
                    datasets: [
                        {
                            label: 'NotDone',
                            data: this.basicDataNotDoneGenracionCNArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para NotDoneGeneracion CN',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }
    buscarStatsNotCancelacion(ini:any,fin:any){
        this.basicDataNotCancelacionArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsNotCancelacion = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        this.cors.get('Estadisticas/estadisticasNotDoneCancelacion',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataNotCancelacionArray.graf.push(key)
                        this.basicDataNotCancelacionArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataNotCancelacionArray.graf.push(key)
                        this.basicDataNotCancelacionArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataNotCancelacionArray.graf.push(key)
                        this.basicDataNotCancelacionArray.esta.push(value)
                      }
                      if(key=='completado'){
                        this.basicDataNotCancelacionArray.graf.push(key)
                        this.basicDataNotCancelacionArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataNotCancelacionArray.graf.push(key)
                        this.basicDataNotCancelacionArray.esta.push(value)
                      }
                    });
                });
                this.basicDataNotCancelacionArray.val=response[0].grafica
                this.basicDataNotCancelacionArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataNotCancelacionArray.solucion=response[0].solucion
                this.basicDataNotCancelacionArray.mes=response[0].mes
                this.basicDataNotCancelacionArray.dia=response[0].dia
                this.basicDataNotCancelacionArray.dia[this.basicDataNotCancelacionArray.dia.length-1].base='Total'
                this.basicDataNotCancelacionArray.status=response[0].status
                this.basicDataNotCancelacionArray.ip=response[0].ip
                this.basicDataNotCancelacion = {
                    labels: this.basicDataNotCancelacionArray.graf,
                    datasets: [
                        {
                            label: 'NotDone',
                            data: this.basicDataNotCancelacionArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para NotDone Cancelacion',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }
    buscarStatsNotCreacionOrdenes(ini:any,fin:any){
        this.basicDataNotCreacionOrdenesArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsNotCreacionOrdenes = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        this.cors.get('Estadisticas/estadisticasCreacionOrdenes',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataNotCreacionOrdenesArray.graf.push(key)
                        this.basicDataNotCreacionOrdenesArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataNotCreacionOrdenesArray.graf.push(key)
                        this.basicDataNotCreacionOrdenesArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataNotCreacionOrdenesArray.graf.push(key)
                        this.basicDataNotCreacionOrdenesArray.esta.push(value)
                      }
                      if(key=='completado'){
                        this.basicDataNotCreacionOrdenesArray.graf.push(key)
                        this.basicDataNotCreacionOrdenesArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataNotCreacionOrdenesArray.graf.push(key)
                        this.basicDataNotCreacionOrdenesArray.esta.push(value)
                      }
                    });
                });
                this.basicDataNotCreacionOrdenesArray.val=response[0].grafica
                this.basicDataNotCreacionOrdenesArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataNotCreacionOrdenesArray.solucion=response[0].solucion
                this.basicDataNotCreacionOrdenesArray.mes=response[0].mes
                this.basicDataNotCreacionOrdenesArray.dia=response[0].dia
                this.basicDataNotCreacionOrdenesArray.dia[this.basicDataNotCreacionOrdenesArray.dia.length-1].base='Total'
                this.basicDataNotCreacionOrdenesArray.status=response[0].status
                this.basicDataNotCreacionOrdenesArray.ip=response[0].ip
                this.basicDataNotCreacionOrdenes = {
                    labels: this.basicDataNotCreacionOrdenesArray.graf,
                    datasets: [
                        {
                            label: 'Creacion ordenes',
                            data: this.basicDataNotCreacionOrdenesArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para Creacion de Ordenes',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }
    buscarStatsCallTrouble(ini:any,fin:any){
        this.basicDataCallTroubleArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsCallTrouble = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        this.cors.get('Estadisticas/estadisticasCallTrouble',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataCallTroubleArray.graf.push(key)
                        this.basicDataCallTroubleArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataCallTroubleArray.graf.push(key)
                        this.basicDataCallTroubleArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataCallTroubleArray.graf.push(key)
                        this.basicDataCallTroubleArray.esta.push(value)
                      }
                      if(key=='completado'){
                        this.basicDataCallTroubleArray.graf.push(key)
                        this.basicDataCallTroubleArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataCallTroubleArray.graf.push(key)
                        this.basicDataCallTroubleArray.esta.push(value)
                      }
                    });
                });
                this.basicDataCallTroubleArray.val=response[0].grafica
                this.basicDataCallTroubleArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataCallTroubleArray.solucion=response[0].solucion
                this.basicDataCallTroubleArray.mes=response[0].mes
                this.basicDataCallTroubleArray.dia=response[0].dia
                this.basicDataCallTroubleArray.dia[this.basicDataCallTroubleArray.dia.length-1].base='Total'
                this.basicDataCallTroubleArray.status=response[0].status
                this.basicDataCallTroubleArray.ip=response[0].ip
                this.basicDataCallTrouble = {
                    labels: this.basicDataCallTroubleArray.graf,
                    datasets: [
                        {
                            label: 'Call Trouble',
                            data: this.basicDataCallTroubleArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para Call Trouble',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }

    buscarStatsOkCliente(ini:any,fin:any){
        this.basicDataOkClienteArray={
            graf:[],
            esta:[],
            val:[],
            categoria:[],
            solucion:[],
            mes:[],
            dia:[],
            status:[],
        };
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.basicOptionsOkCliente = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        this.cors.get('Estadisticas/estadisticasOkCliente',{
            startDateStr:ini,
            endDateStr:fin
        }).then((response) => {
            if(response[0]=='SIN INFO'){
             
            }else{
                let grafica = response[0].grafica;
                grafica.forEach((obj:any) => {
                    Object.entries(obj).forEach(([key, value]) => {
                      if(key=='fallaRPA'){
                        this.basicDataOkClienteArray.graf.push(key)
                        this.basicDataOkClienteArray.esta.push(value)
                      }
                      if(key=='errorOperativo'){
                        this.basicDataOkClienteArray.graf.push(key)
                        this.basicDataOkClienteArray.esta.push(value)
                      }
                      if(key=='registroPendiente'){
                        this.basicDataOkClienteArray.graf.push(key)
                        this.basicDataOkClienteArray.esta.push(value)
                      }
                      if(key=='completado'){
                        this.basicDataOkClienteArray.graf.push(key)
                        this.basicDataOkClienteArray.esta.push(value)
                      }
                      if(key=='inconcistenciaSiebel'){
                        this.basicDataOkClienteArray.graf.push(key)
                        this.basicDataOkClienteArray.esta.push(value)
                      }
                    });
                });
                this.basicDataOkClienteArray.val=response[0].grafica
                this.basicDataOkClienteArray.motivoAjuste=response[0].motivoAjuste
                this.basicDataOkClienteArray.solucion=response[0].solucion
                this.basicDataOkClienteArray.mes=response[0].mes
                this.basicDataOkClienteArray.dia=response[0].dia
                this.basicDataOkClienteArray.dia[this.basicDataOkClienteArray.dia.length-1].base='Total'
                this.basicDataOkClienteArray.status=response[0].status
                this.basicDataOkClienteArray.ip=response[0].ip
                this.basicDataOkCliente = {
                    labels: this.basicDataOkClienteArray.graf,
                    datasets: [
                        {
                            label: 'Ok Cliente',
                            data: this.basicDataOkClienteArray.esta,
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                            borderWidth: 1
                        }
                    ]
                };
        
            }
        }).catch((error) => {
            console.log(error)
            this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se generaron registros para Ok Cliente',
                detail: 'Intenta Nuevamente!!!',
              });
        })
    }
    primeraLetraMayuscula(cadena: string): string {
        if (cadena.length === 0) {
          return cadena; // Devuelve la cadena original si está vacía
        }
        return cadena.charAt(0).toUpperCase() + cadena.slice(1);
    }
    mesFormat(value:any){
        const meses = [
            { ingles: "January", espanol: "Enero" },
            { ingles: "February", espanol: "Febrero" },
            { ingles: "March", espanol: "Marzo" },
            { ingles: "April", espanol: "Abril" },
            { ingles: "May", espanol: "Mayo" },
            { ingles: "June", espanol: "Junio" },
            { ingles: "July", espanol: "Julio" },
            { ingles: "August", espanol: "Agosto" },
            { ingles: "September", espanol: "Septiembre" },
            { ingles: "October", espanol: "Octubre" },
            { ingles: "November", espanol: "Noviembre" },
            { ingles: "December", espanol: "Diciembre" },
            { ingles: "Total", espanol: "Total" }
        ];        
        if(value != null || value!=""){
            if(typeof(value)=='string'){
                const mesTraducido = meses.find((mes:any) => mes.ingles === value)?.espanol;
                return mesTraducido;
            }
            return value
        }else{
            return ""
        }
    }
    // generateExcelWithChart() {
    //      setTimeout(()=>{
    //          this.load=true;
    //           this.activeTabIndex = 0;
    //           setTimeout(()=>{
    //              this.activeTabIndex = 1;
    //              setTimeout(()=>{
    //                 this.activeTabIndex = 2;
    //                 setTimeout(()=>{
    //                    this.activeTabIndex = 3;
    //                     setTimeout(() => {
    //                         const chartElement = this.el.nativeElement.querySelector('#barChart');
    //                         if (chartElement) {
    //                             const canvas: HTMLCanvasElement = chartElement.querySelector('canvas');
    //                             if (canvas) {
    //                                 const chartImageURL = canvas.toDataURL('image/png');
    //                                 const workbook = new ExcelJS.Workbook();
    //                                 const worksheet = workbook.addWorksheet('Depuracion EXT');
    //                                 worksheet.views = [
    //                                 { showGridLines: false }
    //                                 ];
    //                                 const targetColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']

    //                                 for (let rowNumber = 1; rowNumber <= 700; rowNumber++) {
    //                                     targetColumns.forEach((targetColumn) => {
    //                                         const cell = worksheet.getCell(`${targetColumn}${rowNumber}`);
    //                                         cell.alignment = { wrapText:true,vertical: 'middle', horizontal: 'center' };
    //                                     });
    //                                 }
    //                                 const startColumn = 'A';
    //                                 const endColumn = 'P';
                    
    //                                 for (let colNumber = worksheet.getColumn(startColumn).number; colNumber <= worksheet.getColumn(endColumn).number; colNumber++) {
    //                                     const column = worksheet.getColumn(colNumber);
    //                                     let maxLength = 0;
                                        
    //                                    // Iterar sobre cada celda en la columna
    //                                 column.eachCell({ includeEmpty: true }, function (cell: any) {
    //                                     var columnLength = cell.value ? cell.value.toString().length : 20;
    //                                     if (columnLength > maxLength) {
    //                                         maxLength = columnLength;
    //                                     }
    //                                 });
                                
    //                                 column.width = maxLength < 20 ? 20 : maxLength;
    //                             }
    //                             worksheet.getColumn('C').width = 35;
    //                             const imageId = workbook.addImage({
    //                             base64: chartImageURL.split(',')[1],
    //                             extension: 'png',
    //                             });
                    
    //                             worksheet.addImage(imageId, {
    //                             tl: { col: 2, row: 0 },
    //                             ext: { width: 600, height: 400 }, 
    //                             });
                
    //                             let rowStart=25
    //                             for(let i =0;i < this.setStyle.length;i++){
    //                                 worksheet.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                     type: 'pattern',
    //                                     pattern: 'solid',
    //                                     fgColor: { argb: 'FF7987' },
    //                                 }
    //                             }
                
                
    //                             const tableOptions = {
    //                                 name: 'TablaDatos',
    //                                 ref: `A${rowStart}`,  
    //                                 headerRow: true,
    //                                 totalsRow: false,
    //                                 columns: [
    //                                 { name: 'Proceso', filterButton: false },
    //                                 { name: 'Error Operativo', filterButton: false },
    //                                 { name: 'Falla RPA', filterButton: false },
    //                                 { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                 { name: 'Registro Exitoso', filterButton: false },
    //                                 { name: 'Registro Pendiente', filterButton: false },
    //                                 { name: 'Total', filterButton: false },
    //                                 ],
    //                                 rows: this.basicDataExtArray.val.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                             };
                        
    //                             worksheet.addTable(tableOptions);
                
    //                             rowStart = rowStart+this.basicDataExtArray.val.length+2
    //                             for(let i =0;i < this.setStyle.length;i++){
    //                                 worksheet.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                     type: 'pattern',
    //                                     pattern: 'solid',
    //                                     fgColor: { argb: 'FF7987' },
    //                                 }
    //                             }
    //                             const tableOptions1 = {
    //                                 name: 'TablaDatos1',
    //                                 ref: `A${rowStart}`,  
    //                                 headerRow: true,
    //                                 totalsRow: false,
    //                                 columns: [
    //                                 { name: 'Motivo de la Orden', filterButton: false },
    //                                 { name: 'Error Operativo', filterButton: false },
    //                                 { name: 'Falla RPA', filterButton: false },
    //                                 { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                 { name: 'Registro Exitoso', filterButton: false },
    //                                 { name: 'Registro Pendiente', filterButton: false },
    //                                 { name: 'Total', filterButton: false },
    //                                 ],
    //                                 rows: this.basicDataExtArray.motivo.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                             };
                        
    //                             worksheet.addTable(tableOptions1);
                
    //                             rowStart = rowStart+this.basicDataExtArray.motivo.length+2
    //                             for(let i =0;i < this.setStyle.length;i++){
    //                                 worksheet.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                     type: 'pattern',
    //                                     pattern: 'solid',
    //                                     fgColor: { argb: 'FF7987' },
    //                                 }
    //                             }
    //                             const tableOptions2 = {
    //                                 name: 'TablaDatos2',
    //                                 ref: `A${rowStart}`,  
    //                                 headerRow: true,
    //                                 totalsRow: false,
    //                                 columns: [
    //                                 { name: 'Mes', filterButton: false },
    //                                 { name: 'Error Operativo', filterButton: false },
    //                                 { name: 'Falla RPA', filterButton: false },
    //                                 { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                 { name: 'Registro Exitoso', filterButton: false },
    //                                 { name: 'Registro Pendiente', filterButton: false },
    //                                 { name: 'Total', filterButton: false },
    //                                 ],
    //                                 rows: this.basicDataExtArray.mes.map((item:any) => [this.mesFormat(item.base), item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                             };
                        
    //                             worksheet.addTable(tableOptions2);
                
    //                             rowStart = rowStart+this.basicDataExtArray.mes.length+2
    //                             for(let i =0;i < this.setStyle.length;i++){
    //                                 worksheet.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                     type: 'pattern',
    //                                     pattern: 'solid',
    //                                     fgColor: { argb: 'FF7987' },
    //                                 }
    //                             }
    //                             const tableOptions3 = {
    //                                 name: 'TablaDatos3',
    //                                 ref: `A${rowStart}`,  
    //                                 headerRow: true,
    //                                 totalsRow: false,
    //                                 columns: [
    //                                 { name: 'Día', filterButton: false },
    //                                 { name: 'Error Operativo', filterButton: false },
    //                                 { name: 'Falla RPA', filterButton: false },
    //                                 { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                 { name: 'Registro Exitoso', filterButton: false },
    //                                 { name: 'Registro Pendiente', filterButton: false },
    //                                 { name: 'Total', filterButton: false },
    //                                 ],
    //                                 rows: this.basicDataExtArray.dia.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                             };
                        
    //                             worksheet.addTable(tableOptions3);
                
    //                             rowStart = rowStart+this.basicDataExtArray.dia.length+2
    //                             for(let i =0;i < this.setStyle.length;i++){
    //                                 worksheet.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                     type: 'pattern',
    //                                     pattern: 'solid',
    //                                     fgColor: { argb: 'FF7987' },
    //                                 }
    //                             }
    //                             const tableOptions4 = {
    //                                 name: 'TablaDatos4',
    //                                 ref: `A${rowStart}`,  
    //                                 headerRow: true,
    //                                 totalsRow: false,
    //                                 columns: [
    //                                 { name: 'Estatus', filterButton: false },
    //                                 { name: 'Error Operativo', filterButton: false },
    //                                 { name: 'Falla RPA', filterButton: false },
    //                                 { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                 { name: 'Registro Exitoso', filterButton: false },
    //                                 { name: 'Registro Pendiente', filterButton: false },
    //                                 { name: 'Total', filterButton: false },
    //                                 ],
    //                                 rows: this.basicDataExtArray.status.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                             };
                        
    //                             worksheet.addTable(tableOptions4);
                
    //                             //Depuracion cc 
    //                             const chartElement = this.el.nativeElement.querySelector('#barChart1');
    //                             if (chartElement) {
    //                                 const canvas: HTMLCanvasElement = chartElement.querySelector('canvas');
    //                                 if (canvas) {
    //                                     const chartImageURL = canvas.toDataURL('image/png'); 
    //                                     const worksheet1 = workbook.addWorksheet('Depuracion CC');
                                        
    //                                     const targetColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    //                                     worksheet1.views = [
    //                                         { showGridLines: false }
    //                                         ];
    //                                     // Iterar sobre las filas y establecer la alineación para las columnas específicas
    //                                     for (let rowNumber = 1; rowNumber <= 700; rowNumber++) {
    //                                         targetColumns.forEach((targetColumn) => {
    //                                             const cell = worksheet1.getCell(`${targetColumn}${rowNumber}`);
    //                                             cell.alignment = { wrapText:true,vertical: 'middle', horizontal: 'center' };
    //                                         });
    //                                     }
    //                                     const startColumn = 'A';
    //                                     const endColumn = 'P';
                        
    //                                     for (let colNumber = worksheet1.getColumn(startColumn).number; colNumber <= worksheet1.getColumn(endColumn).number; colNumber++) {
    //                                         const column = worksheet1.getColumn(colNumber);
    //                                         let maxLength = 0;
                                        
    //                                         // Iterar sobre cada celda en la columna
    //                                         column.eachCell({ includeEmpty: true }, function (cell: any) {
    //                                             var columnLength = cell.value ? cell.value.toString().length : 20;
    //                                             if (columnLength > maxLength) {
    //                                                 maxLength = columnLength;
    //                                             }
    //                                         });
                                        
    //                                         column.width = maxLength < 20 ? 20 : maxLength;
    //                                     }
    //                                     worksheet1.getColumn('C').width = 35;
                        
    //                                     const imageId = workbook.addImage({
    //                                         base64: chartImageURL.split(',')[1],
    //                                         extension: 'png',
    //                                     });
                                
    //                                     worksheet1.addImage(imageId, {
    //                                     tl: { col: 2, row: 0 },
    //                                     ext: { width: 600, height: 400 }, 
    //                                     });
                
    //                                     let rowStart=25
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet1.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FF7987' },
    //                                         }
    //                                     }
                
                
    //                                     const tableOptions = {
    //                                         name: 'TablaDatos5',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Proceso', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                         { name: 'Registro Exitoso', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataCCArray.val.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet1.addTable(tableOptions);
                
    //                                     rowStart = rowStart+this.basicDataCCArray.val.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet1.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FF7987' },
    //                                         }
    //                                     }
    //                                     const tableOptions1 = {
    //                                         name: 'TablaDatos6',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Motivo de la Orden', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                         { name: 'Registro Exitoso', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataCCArray.motivo.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet1.addTable(tableOptions1);
                
    //                                     rowStart = rowStart+this.basicDataCCArray.motivo.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet1.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FF7987' },
    //                                         }
    //                                     }
    //                                     const tableOptions2 = {
    //                                         name: 'TablaDatos7',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Tipo de la Orden', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                         { name: 'Registro Exitoso', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataCCArray.tipo.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet1.addTable(tableOptions2);
                
    //                                     rowStart = rowStart+this.basicDataCCArray.tipo.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet1.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FF7987' },
    //                                         }
    //                                     }
    //                                     const tableOptions3 = {
    //                                         name: 'TablaDatos7',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Mes', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                         { name: 'Registro Exitoso', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataCCArray.mes.map((item:any) => [this.mesFormat(item.base), item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet1.addTable(tableOptions3);
                
    //                                     rowStart = rowStart+this.basicDataCCArray.mes.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet1.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FF7987' },
    //                                         }
    //                                     }
    //                                     const tableOptions4 = {
    //                                         name: 'TablaDatos8',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Día', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                         { name: 'Registro Exitoso', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataCCArray.dia.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet1.addTable(tableOptions4);
                
    //                                     rowStart = rowStart+this.basicDataCCArray.dia.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet1.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FF7987' },
    //                                         }
    //                                     }
    //                                     const tableOptions5 = {
    //                                         name: 'TablaDatos8',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Estatus', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Orden Cancelada por un tercero', filterButton: false },
    //                                         { name: 'Registro Exitoso', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataCCArray.status.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ordenCancelada,item.registroExitoso,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet1.addTable(tableOptions5);
                                        
                                    
                                    
    //                                 }
    //                             }
                                
    //                             //Ajustes con validacion 
    //                             const chartElement1 = this.el.nativeElement.querySelector('#barChart2');
    //                             if (chartElement1) {
    //                                 const canvas: HTMLCanvasElement = chartElement1.querySelector('canvas');
    //                                 if (canvas) {
    //                                     const chartImageURL = canvas.toDataURL('image/png'); 
    //                                     const worksheet2 = workbook.addWorksheet('Ajustes con Validación');
                                        
    //                                     const targetColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    //                                     worksheet2.views = [
    //                                         { showGridLines: false }
    //                                         ];
    //                                     // Iterar sobre las filas y establecer la alineación para las columnas específicas
    //                                     for (let rowNumber = 1; rowNumber <= 700; rowNumber++) {
    //                                         targetColumns.forEach((targetColumn) => {
    //                                             const cell = worksheet2.getCell(`${targetColumn}${rowNumber}`);
    //                                             cell.alignment = { wrapText:true,vertical: 'middle', horizontal: 'center' };
    //                                         });
    //                                     }
    //                                     const startColumn = 'A';
    //                                     const endColumn = 'P';
                        
    //                                     for (let colNumber = worksheet2.getColumn(startColumn).number; colNumber <= worksheet2.getColumn(endColumn).number; colNumber++) {
    //                                         const column = worksheet2.getColumn(colNumber);
    //                                         let maxLength = 0;
                                        
    //                                         // Iterar sobre cada celda en la columna
    //                                         column.eachCell({ includeEmpty: true }, function (cell: any) {
    //                                             var columnLength = cell.value ? cell.value.toString().length : 20;
    //                                             if (columnLength > maxLength) {
    //                                                 maxLength = columnLength;
    //                                             }
    //                                         });
                                        
    //                                         column.width = maxLength < 20 ? 20 : maxLength;
    //                                     }
    //                                     worksheet2.getColumn('C').width = 35;
                        
    //                                     const imageId = workbook.addImage({
    //                                         base64: chartImageURL.split(',')[1],
    //                                         extension: 'png',
    //                                     });
                                
    //                                     worksheet2.addImage(imageId, {
    //                                     tl: { col: 2, row: 0 },
    //                                     ext: { width: 600, height: 400 }, 
    //                                     });
                
    //                                     let rowStart=25
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet2.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
                
                
    //                                     const tableOptions = {
    //                                         name: 'TablaDatos9',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Proceso', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesConValidacionArray.val.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet2.addTable(tableOptions);
                
    //                                     rowStart = rowStart+this.basicDataAjustesConValidacionArray.val.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet2.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions1 = {
    //                                         name: 'TablaDatos10',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Categoría', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesConValidacionArray.categoria.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet2.addTable(tableOptions1);
                
    //                                     rowStart = rowStart+this.basicDataAjustesConValidacionArray.categoria.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet2.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions2 = {
    //                                         name: 'TablaDatos11',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Solución', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesConValidacionArray.solucion.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet2.addTable(tableOptions2);
                
    //                                     rowStart = rowStart+this.basicDataAjustesConValidacionArray.solucion.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet2.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions3 = {
    //                                         name: 'TablaDatos12',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Mes', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesConValidacionArray.mes.map((item:any) => [this.mesFormat(item.base), item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet2.addTable(tableOptions3);
                
    //                                     rowStart = rowStart+this.basicDataAjustesConValidacionArray.mes.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet2.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions4 = {
    //                                         name: 'TablaDatos13',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Día', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesConValidacionArray.dia.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet2.addTable(tableOptions4);
                
    //                                     rowStart = rowStart+this.basicDataAjustesConValidacionArray.dia.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet2.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions5 = {
    //                                         name: 'TablaDatos14',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Estatus', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesConValidacionArray.status.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet2.addTable(tableOptions5);
                                        
                                    
                                    
    //                                 }
    //                             }
                                
    //                             //Ajustes sin validacion 
    //                             const chartElement2 = this.el.nativeElement.querySelector('#barChart3');
    //                             if (chartElement2) {
    //                                 const canvas: HTMLCanvasElement = chartElement2.querySelector('canvas');
    //                                 if (canvas) {
    //                                     const chartImageURL = canvas.toDataURL('image/png'); 
    //                                     const worksheet3 = workbook.addWorksheet('Ajustes sin Validación');
                                        
    //                                     const targetColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
    //                                     worksheet3.views = [
    //                                         { showGridLines: false }
    //                                         ];
    //                                     // Iterar sobre las filas y establecer la alineación para las columnas específicas
    //                                     for (let rowNumber = 1; rowNumber <= 700; rowNumber++) {
    //                                         targetColumns.forEach((targetColumn) => {
    //                                             const cell = worksheet3.getCell(`${targetColumn}${rowNumber}`);
    //                                             cell.alignment = { wrapText:true,vertical: 'middle', horizontal: 'center' };
    //                                         });
    //                                     }
    //                                     const startColumn = 'A';
    //                                     const endColumn = 'P';
                        
    //                                     for (let colNumber = worksheet3.getColumn(startColumn).number; colNumber <= worksheet3.getColumn(endColumn).number; colNumber++) {
    //                                         const column = worksheet3.getColumn(colNumber);
    //                                         let maxLength = 0;
                                        
    //                                         // Iterar sobre cada celda en la columna
    //                                         column.eachCell({ includeEmpty: true }, function (cell: any) {
    //                                             var columnLength = cell.value ? cell.value.toString().length : 20;
    //                                             if (columnLength > maxLength) {
    //                                                 maxLength = columnLength;
    //                                             }
    //                                         });
                                        
    //                                         column.width = maxLength < 20 ? 20 : maxLength;
    //                                     }
    //                                     worksheet3.getColumn('C').width = 35;
                        
    //                                     const imageId = workbook.addImage({
    //                                         base64: chartImageURL.split(',')[1],
    //                                         extension: 'png',
    //                                     });
                                
    //                                     worksheet3.addImage(imageId, {
    //                                     tl: { col: 2, row: 0 },
    //                                     ext: { width: 600, height: 400 }, 
    //                                     });
                
    //                                     let rowStart=25
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet3.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
                
                
    //                                     const tableOptions = {
    //                                         name: 'TablaDatos15',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Proceso', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesSinValidacionArray.val.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet3.addTable(tableOptions);
                
    //                                     rowStart = rowStart+this.basicDataAjustesSinValidacionArray.val.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet3.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions1 = {
    //                                         name: 'TablaDatos16',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Motivo del Ajuste', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesSinValidacionArray.motivoAjuste.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet3.addTable(tableOptions1);
                
    //                                     rowStart = rowStart+this.basicDataAjustesSinValidacionArray.motivoAjuste.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet3.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions2 = {
    //                                         name: 'TablaDatos17',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Mes', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesSinValidacionArray.mes.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet3.addTable(tableOptions2);
                
                
    //                                     rowStart = rowStart+this.basicDataAjustesSinValidacionArray.mes.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet3.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions4 = {
    //                                         name: 'TablaDatos18',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Día', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesSinValidacionArray.dia.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet3.addTable(tableOptions4);
                
    //                                     rowStart = rowStart+this.basicDataAjustesSinValidacionArray.dia.length+2
    //                                     for(let i =0;i < this.setStyle.length;i++){
    //                                         worksheet3.getCell(`${this.setStyle[i]}${rowStart}`).fill = {
    //                                             type: 'pattern',
    //                                             pattern: 'solid',
    //                                             fgColor: { argb: 'FFBF00' },
    //                                         }
    //                                     }
    //                                     const tableOptions5 = {
    //                                         name: 'TablaDatos19',
    //                                         ref: `A${rowStart}`,  
    //                                         headerRow: true,
    //                                         totalsRow: false,
    //                                         columns: [
    //                                         { name: 'Estatus', filterButton: false },
    //                                         { name: 'Error Operativo', filterButton: false },
    //                                         { name: 'Falla RPA', filterButton: false },
    //                                         { name: 'Ajustes Realizados', filterButton: false },
    //                                         { name: 'Inconsistencia de Siebel', filterButton: false },
    //                                         { name: 'Registro Pendiente', filterButton: false },
    //                                         { name: 'Total', filterButton: false },
    //                                         ],
    //                                         rows: this.basicDataAjustesSinValidacionArray.status.map((item:any) => [item.base, item.errorOperativo, item.fallaRPA,item.ajusteRealizado,item.inconcistenciaSiebel,item.registroPendiente,item.total]),
                
    //                                     };
                                
    //                                     worksheet3.addTable(tableOptions5);
                                        
                                    
                                    
    //                                 }
    //                             }
                
                
    //                             // Guarda el archivo Excel
    //                             workbook.xlsx.writeBuffer().then((buffer) => {
    //                                 const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    //                             saveAs.saveAs(blob, 'DashboardProcesos_Report.xlsx');
    //                         });
    //                     } else {
    //                         console.error('Canvas no encontrado en el elemento de gráfico.');
    //                     }
    //                     } else {
    //                         console.error('Elemento de gráfico no encontrado');
    //                     }
    //                     this.load=false;
    //                     this.activeTabIndex = 0;
    //                     this.messageService.add({
    //                     key:'tst',
    //                     severity: 'success',
    //                     summary: 'Exito',
    //                     detail: 'Se descargo el reporte!',
    //                     });
        

    //                 }, 5000);
    //             },1000)
    //             },1000)
    //         },1000)
    //     },1000);



    // }
    onTabChange(event: any) {
        this.activeTabIndex = event.index
    }
    






}
