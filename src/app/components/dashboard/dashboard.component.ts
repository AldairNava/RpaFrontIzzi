import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DarkService } from '../../services/darkmode/dark.service';
import { CorsService } from '../../services/cors/cors.service';
import {Chart, registerables } from "chart.js";
import { Calendar } from 'primeng/calendar';
// Chart.register(...registerables);


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('monthPicker') myCalendar?: Calendar;
    public cumplimientoOptions: any;
    public cumplimientoData: any;
    public cumplimientoLegend: boolean;
    public sinDatos: boolean = false;
    public reload: boolean = true;

    fechasFiltro: any[] = [];
    fechaIni: string = '';
    fechaFin: string = '';
    tipo: string = 'Servicios';

    mesIni: any;
    mesFin: any;

    anhoIni: any;
    anhoFin: any;
    /* Resumen */
    // totalAudiosCargados: number = 0;

    /* Páginador */
    paginaUno: boolean = true;
    paginaDos: boolean = false;
    paginaTres: boolean = false;
    paginaCuatro: boolean = false;

    retrocede: boolean = false;
    adelanta: boolean = true;

    paginaActual: string = '';

    mode: boolean = false;
    userName: any;

    botones: any[] = [
                        {tipo: 'Servicios',
                        active: true},
                        {tipo: 'soporte'},
                        {tipo: 'retenciones'}
                    ];

    categoria: string = 'Servicios';

    public resumen: any[] = [
                        {
                            nombre: 'Audios cargados',
                            icon: 'pi-cloud-upload',
                            data: ''
                        },
                        {
                            nombre: 'Audios evaluados',
                            icon: 'pi-sync',
                            data: '' 
                        },
                        {
                            nombre: 'Nota de calidad',
                            icon: 'pi-verified',
                            data: ''
                        },
                         {
                            nombre: 'Ejecutivos Evaluados',
                            icon: 'pi-users',
                            data: ''
                        },
                         {
                            nombre: 'Montitoreo x Asesor',
                            icon: 'pi-file-edit',
                            data: ''
                        }
                    ];

    // fetchingResumen: boolean = true;
    fetchingIndicadorGeneral: boolean = true;

    headersIndicador: string[] = [
        'Zona',
        'Audios Cargados',
        'Evaluaciones MarIAna',
        '% Llamadas evaluadas',
        '% Llamadas no evaluadas',
        '# Ejecutivos evaluados',
        'Monitoreos por asesor',
        'Nota de Calidad',
        '% Precisión/Calibrado'
    ];

    // llamadasEvaluadasData: any[] = [];
    llamadasEvaluadasLabels: any[] = [];
    llamadasEvaluadasOptions: any;

    headersOperativos: string[] = [
        'Mes',
        'Nota de Calidad',
        'Evaluaciones MarIAna',
        'Clientes reincidentes',
        '% Clientes reincidentes',
        'Clientes Insatisfechos',
        '% Clientes Insatisfechos',
        'Sentimiento Negativo',
        'Sentimiento Neutro',
        'Sentimiento Positivo',
        'Indice de sentimiento'

    ]

    dataIndicador: any[] = [];

    basicData: any;
    basicData2: any;
    calificacionesData: any;
    basicOptions: any;

    /* Fecha Dashboard */
    fullFecha: any;
    audiosCargadosMes: any = 0;
    audiosAnalizadosMes: any = 0;
    mesActualGrafico: string = '';

    mensajeBienvenida: string = '';



    
    cumplimientoLabels: string[] = [];
    // cumplimientoLegend: boolean = false;
    // cumplimientoData: any[] = [];

    // cargadosAnalizadosOptions: any;
    // public cargadosAnalizadosLabels: any;
    cargadosAnalizadosLegend: boolean = true;
    // cargadosAnalizadosData: any[] = [];

    // cargadosAnalizadosStackedOptions: any = {};
    // cargadosAnalizadosStackedLabels: any[] = [];
    cargadosAnalizadosStackedLegend: boolean = false;
    // cargadosAnalizadosStackedData: any;
    // notaCalidadData: any[] = [];

    // statsCalifData: any = [];
    // statsCalifOptions: any ;

    // solucionClienteData: any = [];
    // solucionClienteOptions: any = [];

    monitoreoPorDivisionData: any = [];
    monitoreoPorDivisionOptions: any = [];

    // notaCalidadLabels: string[] = [];
    notaCalidadLegend: boolean = true;

    headersIndicadorGeneral: any[] = ["Año","Cargados", "Analizados", "%Analizados", "Nota", "Ejecutivos", ">80", "%>80", "70-80", "%70-80", "60-69", "%60-69", "<60", "%<60", "%No Solución"];
    headersAreasOportunidad: any[] = ["Año", "Apertura y Cierre", "Habilidades de escucha y comunicación", "Cortesía y etiqueta", "Manejo de tiempos", "Validación de datos", "Sondeo y análisis", "Apego a políticas y procedimientos", "Solución y confirmación", "Manejo de información"];
    headersEmociones: any[] = ["Año", "Negatividad", "Neutralidad", "Positividad", "Sentimiento General"];

    audios: any[] = [{anho: '2023', cargados: 1500}];

    mesesLetra: string[] = ['nada', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    mesesNum: string[] = ['nada', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    mesesCalidadMonitoreoLetra: string[] = [];
    mesesCalidadMonitoreoNumero: string[] = [];
    calidadMonitoreoNota: any[] = [];
    calidadMonitoreoMonitoreo: any[] = [];


    /* Gráfica Cargados vs Analizados */
    audiosCargados: any;
    audiosAnalizados: any;

    /* Gráfica cargados vs analizados stacker */
    audiosCargadosStacked: any;
    audiosAnalizadosStacked: any;
    labelStacked: any[] = [];

    areasOportunidadData: any[] = [];


    /* Fecha tablas */
    fechaIniTab: string = '';
    fechaFinTab: string = '';

    subcategorias: any;

    

    constructor(private dark: DarkService, private cors: CorsService) {
        this.cumplimientoLegend = true;
        this.sinDatos = false;
    }

    ngAfterViewInit() {

    }

    ngOnInit(): void {
        this.cumplimento([
            { label: 'Apertura y Cierre', value: 80 },
            { label: 'Habilidades de Escucha', value: 70 },
            { label: 'Cortesía y Etiqueta', value: 90 },
            { label: 'Validación de Datos', value: 60 },
            { label: 'Manejo de Tiempos', value: 75 },
            { label: 'Sondeo y Análisis', value: 85 },
            { label: 'Sol y Conf de Acuerdos', value: 95 },
            { label: 'Manejo de Información', value: 65 }
        ]);
        this.getFecha();

        this.darkModeSubscription();
        this.userName = sessionStorage.getItem('user_id');

        this.fetchCumplimiento();


        this.detectarPagina();

        this.fetchAudiosUploaded();

        this.fetchIndicadorGeneral();

        this.fetchStatsCalif();

        this.fetchSolucionCliente();

        this.fetchCalidadMonitoreo();

        // this.fetchcargadosAnalizados();



        this.fetchShortSubs();

        this.fetchTotalesZonas();

        this.labelStacked = [this.mesActualGrafico];

    }

    categoriaSelect(cat: any) {
        this.botones.forEach((boton: any) => {
            if(boton.active) {
                console
                boton.active = false;
            }
            this.sinDatos = true;
        })

        cat.active = true;
        this.tipo = '';
        this.tipo = cat.tipo;
        this.fetchData();

    }

    public fetchingResumen: boolean = true;
    public totalAudiosCargados: number = 0;
//     public resumen: any[] = [
//     { data: 0 },
//     { data: '0%' },
//     { data: '0%' },
//     { data: 0 },
//     { data: 0 }
// ];
rotationDegrees: any = 90;
fetchAudiosUploaded() {
    this.fetchingResumen = true;

    const data = {
        controlador: 'DashboardController',
        metodo: 'fetchAudiosUploaded',
        ini: this.fechaIni,
        fin: this.fechaFin,
        tipo: this.tipo,
        owner: this.userName
    }

    this.cors.post(data).subscribe(
        (res: any) => {
            if (res.status) {
                this.fetchingResumen = false;
                this.sinDatos = false;
                this.totalAudiosCargados = 0;

                this.resumen[0].data = res.data.cargados;
                this.totalAudiosCargados = res.data.cargados;
                this.resumen[1].data = res.data.analizadosPorc.toFixed(2) + '%';
                this.resumen[2].data = res.data.notaCalidadCalculada.toFixed(2);
                this.resumen[3].data = res.data.ejecutivosEvaluados;
                this.resumen[4].data = res.data.monitoreos.toFixed(2);
                this.porcentajeTotales = parseFloat(res.data.notaCalidadCalculada.toFixed(2));

                // Velocímetro : 180 deg = 100%
                this.rotationDegrees = (this.porcentajeTotales * 180) / 100;
                this.audiosCargados = res.data.cargados;
                this.audiosAnalizados = res.data.analizados;
                this.cargadosAnalizados();
                const noAnalizadosPorc = 100 - res.data.analizadosPorc;
                this.cargadosAnalizadosStacked(res.data.analizadosPorc.toFixed(2), noAnalizadosPorc);

            } else {
                this.resumen[0].data = 0;
                this.resumen[1].data = 0 + '%';
                this.resumen[2].data = 0 + '%';
                this.resumen[3].data = 0;
                this.resumen[4].data = 0;
                this.porcentajeTotales = 0;
                this.rotationDegrees = 90;
            }
        },
        (err: any) => {
            console.log(err)
        }
    )
}

    sumaTotales: number = 0
    porcentajeTotales: any = 0;
    
    getFullDataEmocionesSentimientos() {
        const data = {
            controlador: 'dashboardController',
            metodo: 'getFullDataEmocionesSentimientos',
            ini: this.fechaIni,
            fin: this.fechaFin,
            tipo: this.tipo,
            owner: this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                console.log(res)
                this.crearGrafica(res);
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    fetchStatsCalif() {
        const data = {
            controlador: 'dashboardController',
            metodo: 'getStatsCalif',
            ini: this.fechaIni,
            fin: this.fechaFin,
            tipo: this.tipo,
            owner: this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                this.statsCalif(res);
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    /* Genera la gráfica */
    public statsCalifData: any;
    public statsCalifOptions: any;
    // public sinDatos: boolean;

statsCalif(res: any) {
    let mayor80 = 0;
    let entre7080 = 0;
    let entre6069 = 0;
    let menor60 = 0;

    if (res.status) {
        const rangos = res.rangos;
        this.sinDatos = false;
        mayor80 = rangos.mayor80;
        entre7080 = rangos.entre7080;
        entre6069 = rangos.entre6069;
        menor60 = rangos.menorigual59;
    } else {
        this.sinDatos = true;
    }

    this.statsCalifData = {
        labels: ['Mayor a 80', 'Entre 70 y 80', 'Entre 60 y 70', 'Menor de 60'],
        datasets: [
            {
                data: [mayor80, entre7080, entre6069, menor60],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }
        ]
    };

    this.statsCalifOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                bodyColor: 'white',
                titleColor: 'white'
            }
        }
    };
}

crearGrafica(res: any) {
    console.log(res.labels.length);
    console.log(res.neutralidad.length);
    console.log(res.negatividad.length);
    console.log(res.positividad.length);

    const neutralidadData = res.neutralidad.map(Number);
    const negatividadData = res.negatividad.map(Number);
    const positividadData = res.positividad.map(Number);

    // Normalizar los datos si es necesario para que se muestren en porcentaje
    const normalize = (data: number[], max: number) => data.map(value => (value / max) * 100);
    this.emocionesDataG = {
        labels: res.labels,
        datasets: [
            {
                label: '% Negatividad',
                data: negatividadData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: '% Neutralidad',
                data: neutralidadData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: '% Positividad',
                data: positividadData,
                backgroundColor: 'rgba(4, 182, 100, 0.2)',
                borderColor: 'rgba(4, 182, 100, 1)',
                borderWidth: 1
            },
            // {
            //     label: '% Sentimiento general',
            //     data: datosSentimientoGeneral,
            //     backgroundColor: 'rgba(128, 128, 128, 0.3)',
            //     borderColor: 'rgba(128, 128, 128, 1)',
            //     borderWidth: 1,
            //     fill: 'start'
            // }
        ]
    }

    this.emocionesOptions = {
        scales: {
            y: {
                stacked: false,
                ticks: {
                    callback: function(value: any) {
                        return value.toFixed(0) + '%';
                    },
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(2) + '%';
                        }
                        return label;
                    }
                }
            }
        }
    }

    const canvas = document.getElementById('miGrafica') as HTMLCanvasElement;
    if (!canvas) return;

    const ctxTres = canvas.getContext('2d');
    if (!ctxTres) return;

    const miGrafica = new Chart(ctxTres, {
        type: 'line',
        data: this.emocionesDataG,
        options: this.emocionesOptions
    });
}
    emocionesOptions: any;
    emocionesDataG: any;

    fetchSolucionCliente() {
        const data = {
            controlador: 'dashboardController',
            metodo: 'fetchSolucionCliente',
            ini: this.fechaIni,
            fin: this.fechaFin,
            tipo: this.tipo,
            owner: this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                this.solucionCliente(res)
            },
            (err: any) => {
                console.log(err)
            }
        )
    }

    public solucionClienteData: any;
    public solucionClienteOptions: any;

solucionCliente(res: any) {
    const totalAudiosAn = res.res;
    const noSolucion = Math.round((res.noSolucion * 100) / totalAudiosAn);
    const solucion = Math.round((res.solucion * 100) / totalAudiosAn);

    this.solucionClienteData = {
        labels: ['No Solución', 'Solución'],
        datasets: [
            {
                data: [noSolucion, solucion],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    this.solucionClienteOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const value = tooltipItem.formattedValue;
                        return value + '%'; // Agrega el símbolo '%' al valor del tooltip
                    },
                },
                titleFont: {
                    size: 16,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 14,
                },
                bodyColor: 'white',
                titleColor: 'white',
            },
        },
    };
}


    async fetchCalidadMonitoreo() {
        this.calidadMonitoreoNota = [];
        this.calidadMonitoreoMonitoreo = [];

        this.mesesCalidadMonitoreoLetra = this.mesesLetra.slice(this.mesIni, this.mesFin + 1);
        this.mesesCalidadMonitoreoNumero = this.mesesNum.slice(this.mesIni, this.mesFin + 1);



        try {
            for (const mes of this.mesesCalidadMonitoreoNumero) {
                const data = {
                    controlador: 'dashboardController',
                    metodo: 'fetchCalidadMonitoreo',
                    ini: `${this.anhoIni}-${mes}-01 00:00:00`,
                    fin: `${this.anhoFin}-${mes}-${this.obtenerDiasEnElMes(Number(mes) - 1)} 23:59:59`,
                    tipo: this.tipo,
                    owner: this.userName
                };

                const res: any = await this.cors.post(data).toPromise();
                if (res.status) {
                    this.calidadMonitoreoNota.push(Number(res.cargados));
                    this.calidadMonitoreoMonitoreo.push(res.analizados);
                } else {
                    this.calidadMonitoreoNota.push(0);
                    this.calidadMonitoreoMonitoreo.push(0);
                }
            }

            this.calidadyMonitoreo();
        } catch (error) {
            console.log(error);
        }
    }
    public notaCalidadLabels: string[] = [];
    public notaCalidadData: any;
    public notaCalidadOptions: any;

    calidadyMonitoreo() {
        this.notaCalidadLabels = this.mesesCalidadMonitoreoLetra;
        this.notaCalidadData = {
            labels: this.notaCalidadLabels,
            datasets: [
                {
                    data: this.calidadMonitoreoNota,
                    label: 'Nota',
                    type: 'bar',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    data: this.calidadMonitoreoMonitoreo,
                    label: 'Monitoreo',
                    type: 'line',
                    fill: true,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                }
            ]
        };
    
        this.notaCalidadOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top', // Coloca las leyendas en la parte superior de la gráfica
                    labels: {
                        color: 'white', // Color de las leyendas (si es necesario)
                        boxWidth: 10, // Ancho de la caja de la leyenda
                        padding: 10, // Espaciado entre las leyendas
                        // usePointStyle: true, // Usa el estilo de punto para las leyendas
                        font: {
                            size: 8 // Tamaño de la fuente de las leyendas
                        }
                    },
                    align: 'start', // Alinea las leyendas al inicio
                    layout: {
                        padding: {
                            bottom: 10
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white' // Cambia el color de las etiquetas del eje X a blanco
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Cambia el color de las etiquetas del eje Y a blanco
                    }
                }
            }
        };
    }

fetchCumplimiento() {
    const data = {
        controlador: 'dashboardController',
        metodo: 'fetchCumplimiento',
        ini: this.fechaIni,
        fin: this.fechaFin,
        tipo: this.tipo,
        owner: this.userName
    }

    this.cumplimientoLabels = [];

    this.cors.post(data).subscribe(
        (res: any) => {
            const subs = res.subcat;

            // CON ESTO SE CREAN LAS GRÁFICAS SEMICIRCULARES VELOCIMETRO DE LAS SUBCATEGORIAS
            this.subcategorias = res.subcat;

            let porcCumplimientoData: any[] = [];

            this.subcategorias.forEach( (subcat: any) => {
                porcCumplimientoData.push(subcat.calculo);
                this.cumplimientoLabels.push(subcat.short)
            } )

            this.cumplimento(porcCumplimientoData);
        },
        (err: any) => {
            console.log(err);
        }
    );

}

    cumplimento(porcCumplimientoData: any[]) {
        this.cumplimientoOptions = {
        scales: {
            y: {
            ticks: {
                color: 'white' // Cambia el color de las etiquetas del eje Y a blanco
            }
            },
            x: {
            ticks: {
                color: 'white' // Cambia el color de las etiquetas del eje X a blanco
            }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        barPercentage: 0.2,
        categoryPercentage: 1,
        plugins: {
            legend: {
            labels: {
                color: 'white'
            }
            }
        }
        };

        this.cumplimientoLegend = true;

        this.cumplimientoData = {
        labels: porcCumplimientoData.map(item => item.label),
        datasets: [
            {
            data: porcCumplimientoData.map(item => item.value),
            label: '% de cumplimiento',
            backgroundColor: 'rgba(255, 99, 132, 1)'
            }
        ]
        };
    }

    public cargadosAnalizadosLabels: string[] = [];
    public cargadosAnalizadosData: any;
    public cargadosAnalizadosOptions: any;

    cargadosAnalizados() {
        this.cargadosAnalizadosOptions = {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        };
    
        this.cargadosAnalizadosLabels = this.mesesCalidadMonitoreoLetra;
    
        this.cargadosAnalizadosLegend = true;
    
        this.cargadosAnalizadosData = [
            { data: this.audiosCargados, label: 'Audios Cargados' },
            { data: this.audiosAnalizados, label: 'Audios Analizados' }
        ];
    
        // LLAMAR EN FETCHAUDIOSUPLOADED
    }

    public cargadosAnalizadosStackedLabels: string[] = [];
    public cargadosAnalizadosStackedData: any;
    public cargadosAnalizadosStackedOptions: any;
    
    cargadosAnalizadosStacked(analizadosPorc: any, noAnalizadosPorc: any) {
        // const sinAnalizar = Number(this.audiosCargados[0]) - Number(this.audiosAnalizados[0]);

        // const porcAnalizados = Math.round((( Number(this.audiosAnalizados[0]) * 100) / Number(this.audiosCargados[0]) ))
        // const porcNoAnalizados = Math.round((( sinAnalizar * 100) / Number(this.audiosCargados[0]) ))

        this.cargadosAnalizadosStackedOptions = {
            scaleShowVerticalLines: false,
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: 'white' // Cambia el color de las etiquetas del eje X a blanco
                    },
                    barPercentage: 0.2 // Ajusta este valor según el ancho que desees para la barra (0.5 indica el 50% del espacio disponible)
                },
                y: {
                    ticks: {
                        color: 'white' // Cambia el color de las etiquetas del eje Y a blanco
                    }
                }
            },
            plugins: {
                legend: {
                  labels: {
                    color: 'white' // Color blanco para las etiquetas de la leyenda
                  }
                }
            }
        };

        this.cargadosAnalizadosStackedLabels = this.labelStacked;
        this.cargadosAnalizadosStackedLegend = true;

        this.cargadosAnalizadosStackedData = {
            labels: ['% Analizados', '% No Analizados'],
            datasets: [
              {
                data: [analizadosPorc, noAnalizadosPorc],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
              },
            ],
        };
    }

    dataIndicadorGeneral: any[] = [];

    fetchIndicadorGeneral() {
        const data = {
            controlador: 'DashboardController',
            metodo: 'fetchIndicadorGeneral',
            'ini': this.fechaIniTab,
            'fin': this.fechaFinTab,
            'tipo': this.tipo,
            owner: this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                const totalCargados = res.total.totalCargados;
                const totalAnalizados = res.total.totalAnalizados;
                const rangos = res.rangos;
                let tempData = {};

                const porcAnalizados = Math.floor(((res.total.totalAnalizados * 100)) / res.total.totalCargados);

                const mayor80P = Math.floor( (rangos.mayor80 * 100) / totalAnalizados );
                const entre7080P = Math.floor( (rangos.entre7080 * 100) / totalAnalizados );
                const entre6069P = Math.floor( (rangos.entre6069 * 100) / totalAnalizados );
                const menor59P = Math.floor( (rangos.menorigual59 * 100) / totalAnalizados );

                let firstData = {
                    zona: 'Diciembre'
                }

                tempData = {
                    zona: 'Apodaca',
                    cargados: totalCargados,
                    analizados: res.total.totalAnalizados,
                    porcAnalizados: porcAnalizados,
                    nota: '1',
                    ejecutivos: '2',
                    mayor80: rangos.mayor80,
                    mayor80P,
                    entre7080: rangos.entre7080,
                    entre7080P,
                    entre6069: rangos.entre6069,
                    entre6069P,
                    menor59: rangos.menorigual59,
                    menor59P,
                    noSolucion: '2'
                }

                let tempData2 = {
                    zona: 'Metro',
                    cargados: totalCargados,
                    analizados: res.total.totalAnalizados,
                    porcAnalizados: porcAnalizados,
                    nota: '2',
                    ejecutivos: '2',
                    mayor80: rangos.mayor80,
                    mayor80P,
                    entre7080: rangos.entre7080,
                    entre7080P,
                    entre6069: rangos.entre6069,
                    entre6069P,
                    menor59: rangos.menorigual59,
                    menor59P,
                    noSolucion: '2'
                }

                let tempData3 = {
                    zona: 'Cuernavaca',
                    cargados: totalCargados,
                    analizados: res.total.totalAnalizados,
                    porcAnalizados: porcAnalizados,
                    nota: '1',
                    ejecutivos: '2',
                    mayor80: rangos.mayor80,
                    mayor80P,
                    entre7080: rangos.entre7080,
                    entre7080P,
                    entre6069: rangos.entre6069,
                    entre6069P,
                    menor59: rangos.menorigual59,
                    menor59P,
                    noSolucion: '3'
                }

                this.dataIndicadorGeneral.push(firstData);

                this.dataIndicadorGeneral.push(tempData);
                this.dataIndicadorGeneral.push(tempData2);
                this.dataIndicadorGeneral.push(tempData3);
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    fetchAreasOportunidad(data: any) {
        this.areasOportunidadData = data;

        this.areasOportunidadData.unshift('2023');
    }

    emocionesData: any[] = [];



    zonaToFetch: string = '';

    moreInfo(data: any, tabla: string) {
        const posicion = data.Zona; // Asegúrate de que 'Zona' es la propiedad correcta para identificar la posición
        this.fullDataResumenIndicadores = this.concentradoMesCompleto[posicion]['datos'];
    
        if (tabla === 'PT') {
            data['showInfo'] = !data['showInfo'];
        }
    
        if (tabla === 'ST') {
            data['showInfoST'] = !data['showInfoST'];
        }
    }

    fullDataIndicadores: any[] = [];
    fullDataResumenIndicadores: any[] = [];
    totalesZonas: any[] = [];

    fetchTotalesZonas() {
        this.fetchingIndicadorGeneral = true;
        const data = {
            controlador: 'DashboardController',
            metodo: 'fetchZonas',
            'ini': this.fechaIni,
            'fin': this.fechaFin,
            'tipo': this.tipo,
            owner: this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                this.totalesZonas = res.data;
                this.fetchIndicadorGeneralTabla();
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    agrupaResumenIndicadoresFullData() {
        this.fullDataResumenIndicadores = [];

        const fechaActual = new Date();

        const mes = fechaActual.getMonth();
        const anho = fechaActual.getFullYear();

        let iteraciones = this.obtenerDiasEnElMes(mes);
        const data = {
            owner: this.userName,
            mes: mes + 1,
            anho,
            zona: this.zonaToFetch,
            iteraciones
        }
    }

    generarMonitoreosPorDivision() {
        let labelsMonitoreoPorDivison: string[] = [];
        let dataMonitoreoPorDivison: string[] = [];

        this.dataIndicadorGeneralTabla.forEach((data: any, index: number ) => {

            if(data.Zona != this.mesActualGrafico) {
                labelsMonitoreoPorDivison.push(data.zona);
                dataMonitoreoPorDivison.push(data.analizados);
            }
        });

        // this.agrupaResumenIndicadores();

        const pieLabelPlugin = {
            id: 'pieLabelPlugin',
            afterDatasetsDraw(chart: any, args: any, options: any) {
            if (chart.config.type !== 'pie' && chart.config.type !== 'doughnut') {
                return;
            }
              const ctx = chart.ctx;
              chart.data.datasets.forEach((dataset: any, datasetIndex: any) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.data.forEach((element: any, index: any) => {
                  // Calcula la posición de la etiqueta
                  const center = element.getCenterPoint();
                  // Texto que combina el valor y la etiqueta
                const label = chart.data.labels[index];
                const value = dataset.data[index];
                const text = `${label}: ${value}`;

                // Estilos del texto
                ctx.fillStyle = 'black'; // Ajusta según tu esquema de colores
                ctx.font = 'bold 10px Arial'; // Ajusta según tus necesidades
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Dibuja el texto
                ctx.fillText(text, center.x, center.y);
                });
              });
            }
        };

        Chart.register(pieLabelPlugin);

        this.monitoreoPorDivisionData = {
            labels: labelsMonitoreoPorDivison,
            datasets: [
              {
                data: dataMonitoreoPorDivison,
                backgroundColor: ['rgb(204,4,148)', 'rgb(50,203,203)', 'rgb(238,125,48)', 'rgb(253,204,3)'],
                borderColor: ['rgb(204,4,148)', 'rgb(50,203,203)', 'rgb(238,125,48)'],
                borderWidth: 1,
              },
            ],
        };

        this.monitoreoPorDivisionOptions = {
            responsive: true, // Habilita la responsividad
            maintainAspectRatio: false, // Opcional, dependiendo de si quieres mantener la relación de aspecto

            plugins: {
              legend: {
                display: false,
                labels: {
                  color: 'white',
                },
              },
              tooltip: {
                // callbacks: {
                //   label: (tooltipItem: any) => {
                //     const value = tooltipItem.formattedValue
                //     return value + '%';
                //   },
                // },
                titleFont: {
                  size: 16,
                  weight: 'bold',
                },
                bodyFont: {
                  size: 14,
                },
                bodyColor: 'white',
                titleColor: 'white',
              },
              datalabelsPlugin: {}
            },
        };
    }
    public llamadasEvaluadasData: any;

    generarLlamadasEvaluadas(dataDB: any) {
        this.llamadasEvaluadasData = {
            labels: [this.mesActualGrafico],
            datasets: []
        };
    
        this.llamadasEvaluadasOptions = {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        };
    
        let colors = ['#CC0494', '#32CBCB', '#EE7D30', '#FDCC03'];
    
        dataDB.forEach((element: any, index: number) => {
            if (element.Zona != this.mesActualGrafico) {
                let obj = {
                    data: [element.cargados],
                    label: element.zona,
                    backgroundColor: colors[index % colors.length],
                    borderColor: colors[index % colors.length],
                    borderWidth: 1
                };
    
                this.llamadasEvaluadasData.datasets.push(obj);
            }
        });
    }
    
    getFecha() {
        this.fechasFiltro[0] = new Date();
        const fechaActual = new Date();
        let hora = fechaActual.getHours();

        const horaCadena = hora.toString();


        if(horaCadena >= '0' || horaCadena <= '11') {
            this.mensajeBienvenida = 'Buen día';
        }

        if(horaCadena >= '12' && horaCadena <= '19') {
            this.mensajeBienvenida = 'Buena tarde';
        }

        if(horaCadena >= '20' && horaCadena <= '23') {
            this.mensajeBienvenida = 'Buena noche';
        }

        const diaDelMes = fechaActual.getDate();
        const dia = fechaActual.getDay();
        const mes = fechaActual.getMonth();
        const año = fechaActual.getFullYear();

        this.fechaIniTab = `${año}-01-01 00:00:00`;
        this.fechaFinTab = `${año}-12-31 23:59:59`;

        this.anhoIni = año;
        this.anhoFin = año;

        /* Meses para la consulta SQL */
        const mesActual = mes + 1;

        /* El mes que se obtiene es 1 menos al actual, ejemplo 10 representa nov */
        /*
            0 - ENERO
            1- FEBRERO
            2 - MARZO
            3 - ABRIL
            4 - MAYO
            5 - JUNIO
            6 - JULIO
            7 - AGOSTO
            8 - SEPTIEMBRE
            9 - OCTUBRE
            10 - NOVIEMBRE
            11 - DICIEMBRE
        */

        const totalDias = this.obtenerDiasEnElMes(mes);

        this.fechaIni = `${año}-${mesActual}-01 00:00:00`;
        this.fechaFin = `${año}-${mesActual}-${totalDias} 23:59:59`;

        this.mesIni = mesActual;
        this.mesFin = mesActual;

        // console.log(this.fechaIni);
        // console.log(this.fechaFin);

        const mesLetra = this.obtenerNombreMes(mes);
        this.mesActualGrafico = mesLetra;

        const diaLetra = this.obtenerNombreDia(dia);

        this.fullFecha = `${diaLetra} ${diaDelMes} de ${mesLetra} de ${año}`;
    }

    obtenerNombreMes(numeroMes: number): string {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril',
            'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        return meses[numeroMes];
    }

    obtenerNombreDia(numeroMes: number): string {
        const meses = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves',
            'Viernes', 'Sábado'
        ];

        return meses[numeroMes];
    }

    obtenerDiasEnElMes(mes: number): number {
        const fechaActual = new Date();
        const mesActual = mes;
        const anioActual = fechaActual.getFullYear();

        // El último día del mes es el día 0 del siguiente mes
        const ultimoDiaDelMes = new Date(anioActual, mesActual + 1, 0);

        // Obtener el día del mes del último día
        const diasEnElMes = ultimoDiaDelMes.getDate();

        return diasEnElMes;
    }

    detectarPagina() {
        if(this.paginaUno) {
            this.paginaActual = '1';
            return 'uno';
        }

        if(this.paginaDos) {
            return 'dos';
        }

        if(this.paginaTres) {
            return 'tres';
        }

        if(this.paginaCuatro) {
            return 'cuatro';
        }

        return 'ninguna página detectada';
    }

    nextPage() {
        const pagina = this.detectarPagina();

        // Cambia a página 2
        if(pagina === 'uno') {
            this.paginaUno = false;
            this.paginaDos = true;
            this.paginaTres = false;
            this.retrocede = true;

            this.paginaActual = '2';

        }

        if(pagina === 'dos') {
            this.paginaUno = false;
            this.paginaDos = false;
            this.paginaTres = true;
            this.retrocede = true;
            this.adelanta = true;

            this.paginaActual = '3';
        }

        if(pagina === 'tres') {
            this.paginaUno = false;
            this.paginaDos = false;
            this.paginaTres = false;
            this.paginaCuatro = true;
            this.retrocede = true;
            this.adelanta = false;

            this.paginaActual = '4';
        }
    }

    prevPage() {
        const pagina = this.detectarPagina();
        if(pagina === 'cuatro') {
            this.paginaUno = false;
            this.paginaDos = false;
            this.paginaTres = true;
            this.paginaCuatro = false;
            this.retrocede = true;
            this.adelanta = true;

            this.paginaActual = '3';
        }

        // Cambia a página 2
        if(pagina === 'tres') {
            this.paginaUno = false;
            this.paginaDos = true;
            this.paginaTres = false;
            this.retrocede = true;
            this.adelanta = true;

            this.paginaActual = '2';
        }

        if(pagina === 'dos') {
            this.paginaUno = true;
            this.paginaDos = false;
            this.paginaTres = false;
            this.retrocede = false;
            this.adelanta = true;

            this.paginaActual = '1';
        }
    }

    cambiaFechas() {
        const añoIni = this.fechasFiltro[0].getFullYear();
        this.anhoIni = añoIni;

        const mesIni = this.fechasFiltro[0].getMonth();

        const mesIniConsulta = mesIni + 1;
        this.mesIni = mesIniConsulta;
        this.mesFin = mesIniConsulta;


        const totalDiasIni = this.obtenerDiasEnElMes(mesIni);

        this.fechaIni = `${añoIni}-${mesIniConsulta}-01 00:00:00`;
        this.fechaFin = `${añoIni}-${mesIniConsulta}-${totalDiasIni} 23:59:59`;

        if(this.fechasFiltro[1]) {
            const añoFin = this.fechasFiltro[1].getFullYear();
            this.anhoFin = añoFin;
            const mesFin = this.fechasFiltro[1]?.getMonth();

            const mesFinConsulta = mesFin + 1;
            this.mesFin = mesFinConsulta;

            const totalDiasFin = this.obtenerDiasEnElMes(mesFin);

            this.fechaFin = `${añoFin}-${mesFinConsulta}-${totalDiasFin} 23:59:59`;

            console.log(this.obtenerNombreMes(mesFin))

            this.labelStacked = [`${this.obtenerNombreMes(mesIni)} - ${this.obtenerNombreMes(mesFin)}`]


            this.fetchData();
        } else {
            // this.fetchData();
        }


    }

    dataIndicadorGeneralTabla: any[] = [];

    // Primer tabla del dash
    fetchIndicadorGeneralTabla() {
        this.fetchingIndicadorGeneral = true;
        const data = {
            controlador: 'DashboardController',
            metodo: 'getFullDataTablas',
            ini: this.fechaIni,
            fin: this.fechaFin,
            tipo: this.tipo,
            owner: this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                if(res.status) {
                    this.fetchingIndicadorGeneral = false;
                }

                this.dataIndicadorGeneralTabla = res.data;

                // Genera la gráfica Monitoreos por división
                this.generarMonitoreosPorDivision()

                // Genera la gráfica % Llamadas evaluadas
                this.generarLlamadasEvaluadas(res.data)

                // Llama los datos para el mes completo
                this.getIndicadorDiario();
            },
            (err: any) => {
                console.log(err)
                this.fetchingIndicadorGeneral = false;
            }
        )

    }

    dataResumenIndicadorGeneral: any[] = [];

    getIndicadorDiario() {
        const data = {
            controlador: 'DashboardController',
            metodo: 'getIndicadorDiario',
            tipo: this.tipo
        }
        this.cors.post(data).subscribe(
            (res: any) => {
                this.concentradoMesCompleto = res.data;
            },
            (err: any) => {
                console.log(err)
            }
        )
    }
    concentradoMesCompleto: any[] = [];


    // agruparResumenIndicadores y fetchZonasResumen construyen los datos de la tabla
    // Resumen indicador general, solo el resumen por zona, no se incluye dia por dia
    agrupaResumenIndicadores() {
        this.dataResumenIndicadorGeneral = [];
        let obj = {
            'Zona': this.mesActualGrafico
        };

        this.dataResumenIndicadorGeneral.push(obj);

        // this.dataIndicadorGeneralTabla.forEach((element: any) => {
        //     if(element.Zona != this.mesActualGrafico) {
        //         let Obj = {
        //             'Zona': element.Zona,
        //             'cargados': element.Total,
        //             'notaCalidad': element.nota,
        //             'Alizzia': element.Alizzia,
        //             'reincidentes': 0,
        //             'reincidentesPorc': 0 + '%',
        //             'insatisfechos': 0,
        //             'insatisfechosPorc': 0 + '%',
        //             'negativo': 0,
        //             'neutro': 0,
        //             'positivo': 0,
        //             'sentimiento': 0,
        //             'showInfo': false
        //         }

        //         this.dataResumenIndicadorGeneral.push(Obj);
        //     }
        // })

        this.fetchZonasResumen();
    }

    negatividadTotal: number = 0;
    neutralidadTotal: number = 0;
    positividadTotal: number = 0;

    // DATOS PARA CONSTRUIR LA PRIMERA PARTE DE LA SEGUNDA TABLA (NEGATIVIDAD, POSITIVDAD, ETC)
    fetchZonasResumen() {
        const data = {
            controlador: 'DashboardController',
            metodo: 'fetchZonasResumen',
            'ini': this.fechaIni,
            'fin': this.fechaFin,
            'tipo': this.tipo,
            'owner': this.userName
        }

        this.cors.post(data).subscribe(
            (res: any) => {
                let resumen = res.data;

                this.dataResumenIndicadorGeneral.forEach((element: any, index: number) => {
                    if(element.Zona != this.mesActualGrafico) {
                        resumen.forEach((el: any) => {
                            if(el.zona === element.Zona) {
                                let reincidentes = el.reincidentes;
                                element.reincidentes = reincidentes;

                                let reincidentesPorc = ((reincidentes * 100) / element.cargados).toFixed(2) + '%';
                                element.reincidentesPorc = reincidentesPorc;

                                let insatisfechos = el.insatisfechos;
                                element.insatisfechos = insatisfechos;

                                let insatisfechosPorc = ((insatisfechos * 100) / element.cargados).toFixed(2) + '%';
                                element.insatisfechosPorc = insatisfechosPorc;

                                element.negativo = el.negatividad;
                                this.negatividadTotal = this.negatividadTotal + element.negativo;

                                element.neutro = el.neutralidad;
                                this.neutralidadTotal = this.neutralidadTotal + Number(element.neutro);

                                element.positivo = el.positividad;
                                this.positividadTotal = this.positividadTotal + element.positivo;

                                element.sentimiento = el.general;
                            }
                        })
                    }
                })
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    fetchData() {
        this.reload = false;

        this.fetchAudiosUploaded();

        this.fetchStatsCalif();

        this.fetchSolucionCliente();

        this.fetchCalidadMonitoreo();

        // this.fetchcargadosAnalizados();

        this.fetchIndicadorGeneral();

        this.fetchCumplimiento();

        this.fetchShortSubs();

        this.fetchTotalesZonas();

        this.reload = true;
    }

    shortSubs: any[] = [];

    fetchShortSubs() {
        const data = {
            controlador: 'dashboardController',
            metodo: 'fetchShortSubs'
        }
        this.cors.post(data).subscribe(
            (res: any) => {
                res.data.forEach((element: any, index: number) => {
                    if(element.sub != 'Groserias' && element.sub != 'Manejo de Herramientas') {
                        let obj = {
                            name: element.short,
                            margin: 0
                        }

                        this.shortSubs.push(obj);
                    }


                });

                this.shortSubs.forEach((element: any) => {
                    if(element.name === 'Apertura y Cierre' || element.name === 'Sondeo y Análisis') {
                        element.margin = 22
                    }
                });
            },
            (err: any) => {
                console.log(err);
            }
        )
    }





    private darkModeSubscription(): void {
        this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
        this.mode = isDarkModeEnabled;
        });
    }
}