import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CorsService } from '../../services/cors/cors.service';

import { Router } from '@angular/router';

import { DarkService } from '../../services/darkmode/dark.service';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
  providers: [MessageService]
})

export class ResultadosComponent implements OnInit {

  dataLlamada: any[] = [{AHT: 'N / A', tipo: ' N / A', asesor: 'Renato Manuel Gonález Terrazas'}];
  dataDLlamada: any[] = [{supervisor: 'Romero Alemán Samuel', monitoreo: 'Grabación', id: ''}];

  headersPrimero = [
    'AHT', 'Tipo de llamada', 'Asesor'
  ];

  headersSegundo = [
    'Supervisor', 'Tipo de Monitoreo', 'ID llamada'
  ];

  headersCalificaciones = [
    'Rubro', 'Score'
  ]



  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  ruta: string = 'C:/Users/La mamalona1/Documents/audiosGit/AudiosBack/public/audios/';
  rutaAudio: string = '';

  resumenLlamada: any;
  contextoGeneral: any;

  transcripcion: any;
  chat: any = [];
  search: boolean = false;
  filteredChat: any = [];
  filteredChatObject: any = []
  messages = [];
  emociones: any;
  emocionesObj: any = {};
  emocionesArray: any = [];

  showInfo: boolean = false

  conversation: any = [];
  
  globalName: string = '';

  aprycie: number = 0;

  /* Emojis */
  negatividad: boolean = false;
  meh: boolean = false;
  neutral: boolean = false;
  slightly: boolean = false;
  positividad: boolean = false;

  mode: boolean = false;

  /* Calificaciones en base a la guía */
  calificacionesI: any;
  puntosCategorias: any;
  arrayFull: any[] = [];
  calificacionesAgrupadas:any[] = [];
  totalAcumulado: number = 0;
  resultado: any;
  porcentaje: number = 0;


  /* EXTERNO */
  filename: any;
  tablaConsulta: any;
  mejorar: string = '';

  categoriasIzzi: any[] = [];

  guia: string = '';

  constructor(private route: ActivatedRoute,
  private cors: CorsService,
  private messageService: MessageService,
  private dark: DarkService, 
  private router: Router) {
  } 

  variablesHidden: any = {
    
  }

  breadAnalista: boolean = false;

  idAnalista: any = '';

  ngOnInit(): void {
    const tempName: any = this.route.snapshot.paramMap.get('tempName');

    const origen = this.route.snapshot.paramMap.get('origen');

    this.descargarAudio(tempName);

    this.idAnalista = origen;

    if(origen != 'main') {
      this.breadAnalista = true;
    }
    this.filename = tempName;


    if(tempName) {
      this.fetchAHT(tempName);
      this.rutaAudio = this.cors.audio(tempName);

      console.log(this.rutaAudio)
    }

    const guia = this.route.snapshot.paramMap.get('guia');
    if(guia) {
      this.guia = guia;
    }

    if(guia === 'guia') {
      const data = {
        controlador: 'resultadosController',
        metodo: 'getGuiaS',
        'name': tempName
      }

      this.cors.post(data).subscribe(
        (res: any) => {
          this.guia = res.row[0].guia;
        },
        (err: any) => {
          console.log(err)
        }
      )
    }

    const tabla = `calificaciones_${guia}`;
    this.tablaConsulta = tabla;

    this.items = [{ label: 'Analizar Audios', routerLink: '/analizar' }, {label: 'Resultados'}];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    if(tempName) {

      this.getGuia(guia);

      this.getCalidad(tempName);

      this.globalName = tempName;

      /* Para la nueva vista */
      this.fetchInfoTabla();
      this.getContextos(tempName);
      this.fetchCategorias();

    }

    this.darkModeSubscription();
  }

  showPlayer: boolean = false;

  descargarAudio(audioName: string) {
    const data = {
      controlador: 'AudiosController',
      metodo: 'copiaAudioTemp',
      audioName
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.showPlayer = true;
        }
        
      },
      (err: any) => {

      }
    )
  }


  fetchInfoTabla() {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'fetchInfoTabla',
      filename: this.filename
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        let data = res.data;
        this.dataLlamada[0].agente = data.nomAsesor; 

        const string = data.tipo;
        let primerLetra = string.charAt(0).toUpperCase();
        let resto = string.slice(1);
        this.dataLlamada[0].tipo = primerLetra + resto; 

        const parts = this.filename.split('.');
        this.dataDLlamada[0].id = parts[0]; 

      }, (error) => {
        console.log(error);
      }
    )

  }

  fetchAHT(filename: string) {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'fetchAHT',
      filename: filename
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        this.dataLlamada[0].AHT = res.AHT;
        this.dataLlamada[0].asesor = res.nomAsesor;

      }, (error) => {
        console.log(error);
      }
    )

  }

  fetchCategorias() {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'fetchCategorias',
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        let categorias = res.data;

        categorias.forEach((categoria: any) => {
          this.categoriasIzzi.push(categoria.nombre_categoria);
        })
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  getContextos(tempName: string) {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'getContextos',
      name: tempName
    }
    
    this.cors.post(data).subscribe(
      (response: any) => {
        const contextos = response['row'];

        const partsResumen = contextos.resumen.split('.');

        this.resumenLlamada = [];
        
        partsResumen.forEach((part: any, index: number) => {
          if(index < 3 ) {
            this.resumenLlamada.push(part);
          }
        })

        this.contextoGeneral = contextos.contexto_general;
      }, (error) => {
        console.log(error);
      }
    )
}


  /* OBTIENE LAS CALIFICACIONES EN BASE A LA GUIA */
  getCalificacionesGuia(tempName: string, guia: any) {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'getCalificacionesGuia',
      name: tempName,
      guia: guia
    }
    
    this.cors.post(data).subscribe(
      (res: any) => {
        console.log(res)
        if(res.status) {
          this.separaPuntos(res.row.punto_de_vista)
          this.resultado = Number(res.row.resultado);
          this.porcentaje = Math.floor( ( (this.resultado * 100 ) ) / 100 );
          this.calificacionesI = res.row;
          this.fullArrayFunc();
          this.obtienePuntoVista(res.row.punto_de_vista)
        }
      }, (error) => {
        console.log(error)
      }
    )
  }

  respuestaApi: any = [];

  separaPuntos(pv: any) {
    let cadena = pv
    let cadenaSinEspacios = cadena.replace(/\s/g, "");

    this.puntosCategorias.forEach((punto: any) => {
      let regex = new RegExp(`\\|${punto.nombre_punto}[^\n]*\\|`);
  
      let match = cadenaSinEspacios.match(regex);
  
      if (match) {
          let resultado = match[0];
          let resultadoArray = resultado.split('|');
          if(resultadoArray[2].trim() === '1') {
            const puntoObj = {
              [resultadoArray[1].trim()]: 'Si'
            };
            this.respuestaApi.push(puntoObj)
          } else {
            const puntoObj = {
              [resultadoArray[1].trim()]: resultadoArray[3].trim()
            };
            this.respuestaApi.push(puntoObj)
          }
      } else {
        // Esta aplica para groserías
          console.log("No se encontró la coincidencia.");
      }
  });


  }

  getGuia(guia: any) {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'getGuia',
      'guia': guia
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.puntosCategorias = res.row;

          this.getCalificacionesGuia(this.filename, this.tablaConsulta)
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  fullArrayFunc() {

    this.puntosCategorias.forEach((punto: any) => {
      const nombre_subcategoria_guion = this.formateaSubcategoria(punto.nombre_subcategoria);
      this.variablesHidden[nombre_subcategoria_guion] = false;

      let cali = punto.nombre_punto;
      const data = {
        idSubcat: punto.id_subcategoria,
        nombre_punto: punto.nombre_punto,
        procedimiento: punto.procedimiento,
        nombre_subcategoria: punto.nombre_subcategoria,
        nombre_subcategoria_guion,
        calificacion: this.calificacionesI[cali],
        calificacionObj: {
          [cali]: this.calificacionesI[cali]
        }
      };

      this.arrayFull.push(data);

    })


    // Agrupar objetos por nombre_subcategoria
    const objetosAgrupados = this.arrayFull.reduce((subcategoria, objeto) => {
      
      const { nombre_subcategoria } = objeto;

      if (!subcategoria[nombre_subcategoria]) {
          subcategoria[nombre_subcategoria] = [];
      }

      subcategoria[nombre_subcategoria].push(objeto);

      return subcategoria;
    }, {});

    // Convertir el objeto agrupado a un array si es necesario
    this.calificacionesAgrupadas = Object.values(objetosAgrupados);

    this.calificar();
    
  }

  calificar() {
    this.calificacionesAgrupadas.forEach( array => {
      const data = {
        'nombre_punto': 'Total',
        'calificacion': 0,
        
      }
      array.push(data)
      this.ind(array)
    })

    this.addCategoria();
      

  }

  ind(array: any) {
    let suma = 10;
    let sumaValida = 0;
    let valida = false;

    array.forEach((element: any) => {
      if( element.nombre_punto != 'Total' && Number(element.calificacion) <= 0 ) {
        element.calificacion = 'pi pi-times'
        suma = 0;
      } 

      if(element.nombre_punto != 'Total' && Number(element.calificacion) > 0) {
        element.calificacion = 'pi pi-check'
      } 

      if(element.nombre_subcategoria === 'Manejo de Herramientas' && element.calificacion != 'pi pi-times') {
        element.calificacion = 'pi pi-check';
        suma = 15;
      }

      if(element.nombre_subcategoria === 'Solución y Confirmación de Acuerdos' && element.calificacion != 'pi pi-times') {
        suma = 5;
      }

      if(element.nombre_subcategoria === 'Apego a Politicas y Procedimientos' && element.calificacion === 'pi pi-check' && (this.guia === 'guia_set_7' || this.guia === 'guia_set_8' || this.guia === 'guia_set_9' || this.guia === 'guia_set_10' || this.guia === 'guia_set_11' || this.guia === 'guia_set_12')) {
        sumaValida = 10;
        valida = true;
      }


      if(element.nombre_punto === 'Total') {
        element.calificacion = suma;
      }

      if(element.nombre_punto === 'Total' && valida) {
        element.calificacion = sumaValida;
      }

    
    });

    this.totalAcumulado = this.totalAcumulado + suma + 15;

  }

  agrupadosPorCategorias: any[] = [];
  totalesCategorias: any = {};
  esperadosCategorias: any = {}

  calificacionesAgrupadasSinG: any[] = [];

  addCategoria() {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'fetchSubcategorias',
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        let subcategorias = res.data;

        subcategorias.shift();


        let agrupadosPorCategoria: any = {};

        this.calificacionesAgrupadasSinG = this.calificacionesAgrupadas.filter((element) => {
          return element[0].nombre_punto !== 'groserias';
        });

        this.calificacionesAgrupadasSinG.forEach((element: any, index: number) => {
          if (subcategorias[index] && subcategorias[index].nombre_subcategoria === element[0].nombre_subcategoria) {
            let iteraciones = element.length;
            for (let i = 0; i < iteraciones; i++) {
              element[i].categoria = subcategorias[index].id_categoria;
            }
          }
    
          if (subcategorias[index] && subcategorias[index].id_categoria === element[0].categoria) {
            // Añadir elementos al nuevo arreglo basado en la categoría
            let categoriaId = element[0].categoria;
            if (!agrupadosPorCategoria[categoriaId]) {
              agrupadosPorCategoria[categoriaId] = [];
            }
            agrupadosPorCategoria[categoriaId].push(element);
          }

        });

    
        // Ahora agrupadosPorCategoria contiene los elementos separados por categoría
        this.categoriasIzzi.forEach((categoria: any, index: number) => {
          this.agrupadosPorCategorias.push(agrupadosPorCategoria[index + 1])
        })


        this.agrupadosPorCategorias.forEach((arrayCategoria: any, index: number) => {
          let sumaTotal = 0;
          
          arrayCategoria.forEach((categoria: any) => {
            let categoriaLength = categoria.length;
            sumaTotal += categoria[categoriaLength - 1].calificacion;
          });

          this.totalesCategorias[this.categoriasIzzi[index]] = sumaTotal;

          if( arrayCategoria[0][0].categoria === '1' ) {
            this.esperadosCategorias[this.categoriasIzzi[index]] = 40;
          }
          
          if( arrayCategoria[0][0].categoria === '2' ) {
            this.esperadosCategorias[this.categoriasIzzi[index]] = 45;
          }

          if( arrayCategoria[0][0].categoria === '3' ) {
            this.esperadosCategorias[this.categoriasIzzi[index]] = 15;
          }

        })
      },
      (err: any) => {
        console.log(err);
      }
    );
    
  }

  mejoras: any[] = [];

  obtienePuntoVista(data: string) {
      let posicionPuntosAMejorar = []; 
      posicionPuntosAMejorar = data.split("Puntos a mejorar");

      if( posicionPuntosAMejorar.length === 1 ) {
        posicionPuntosAMejorar = [];

        posicionPuntosAMejorar = data.split('Mejoras');
      }

      if( posicionPuntosAMejorar.length === 1 ) {
        posicionPuntosAMejorar = [];

        posicionPuntosAMejorar = data.split('puntos a mejorar');
      }

      let mejoras = posicionPuntosAMejorar[1];
      let parrafos = mejoras.split(/(?=[A-Z])/);

      parrafos.shift();
      this.mejoras = parrafos;

  }

 separarEnOraciones() {
  // Dividir el texto por '. ' para obtener cada oración
  let oraciones = this.mejorar.split('.');

  // Filtrar y limpiar las oraciones para eliminar espacios adicionales y otros caracteres
  oraciones = oraciones.map(oracion => {
    // Eliminar espacios al principio y al final de cada oración
    return oracion.trim();
}).filter(oracion => {
    // Eliminar cualquier cadena vacía que pueda surgir
    return oracion.length > 0;
});

  return oraciones;
} 

  rotacionSentimiento: number = 0;
  colorSentimiento: string = '';
  sentimientoActual: string = '';
  justificacion_sentimiento = 'No se pudo obtener la justificación';

  /* Transcripción, emociones, chat, transcripción original */
  getCalidad(tempName: string) {
    const data = {
      controlador: 'ResultadosController',
      metodo: 'getCalidad',
      name: tempName
    }
    
    this.cors.post(data).subscribe(
      (response: any) => {
        const calidad = response['row'];
        let negatividad = parseFloat(calidad.Negatividad);
        let neutralidad = parseFloat(calidad.Neutralidad);
        let positividad = parseFloat(calidad.Positividad);

        if(negatividad === 0 && neutralidad === 0 && positividad === 0) {
          this.neutral = true;
          this.calcularRotacion(10);
          this.colorSentimiento = 'red';
          this.sentimientoActual = 'Negativo';
        }
        if (negatividad > 0 && neutralidad > 0 && positividad === 0 ) {
          this.meh = true;
          this.calcularRotacion(25);
          this.colorSentimiento = 'red';
          this.sentimientoActual = 'Neutro--'
        }
        if (negatividad > 0 && neutralidad === 0 && positividad === 0 ) {
          this.negatividad = true;
          this.colorSentimiento = 'red';
          this.calcularRotacion(10);
          this.colorSentimiento = 'red'
          this.sentimientoActual = 'Negativo';
        }
        if(negatividad === 0 && neutralidad > 0 && positividad === 0) {
          this.neutral = true;
          this.calcularRotacion(50);
          this.colorSentimiento = '#ffcc04';
          this.sentimientoActual = 'Neutro';
        }
        if(negatividad === 0 && neutralidad > 0 && positividad > 0) {
          this.slightly = true;
          this.calcularRotacion(75);
          this.colorSentimiento = '#ffcc04'
          this.sentimientoActual = 'Neutro++';
        }
        if(negatividad === 0 && neutralidad === 0 && positividad > 0) {
          this.positividad = true;
          this.calcularRotacion(100);
          this.colorSentimiento = 'green';
          this.sentimientoActual = 'Positivo';
        }
        
        this.transcripcion = calidad.transcripcion;
        console.log(this.transcripcion)
        this.chat = [calidad.chat][0];

        /* CHAT */
        this.conversation = this.parseConversationText(this.chat);

        let justificacion = calidad.justificacion_emociones;
        let splice = justificacion.split('Justificación:')

        this.justificacion_sentimiento = splice[1];

        console.log('AQUI VA LA TRANSCRIPCION')
        

      }, (error) => {
        console.log(error);
      }
    )
  }

  porcSentimiento: number = 0;
  bgImg: string = 'linear-gradient(to right, #00FF00 0%, #FFFF00 50%, red 100%)';

  calcularRotacion(calificacion: number) {
    this.porcSentimiento = calificacion;
    this.rotacionSentimiento = ( calificacion * 0.5 ) / 100;
  }


  parseConversationText(text: string) {
    const chatArray = [];
    const regex = /^([^\n:]+):\s*(.+)$/gm;
  
    let match;
    while ((match = regex.exec(text)) !== null) {
      const [, speaker, message] = match;
      const normalizedSpeaker = this.normalizeSpeakerName(speaker);
      
      if (normalizedSpeaker === 'AT') {
        chatArray.push({ AT: message });
      } else if (normalizedSpeaker === 'C') {
        chatArray.push({ C: message });
      }
    }
  
    return chatArray;
  }
  
  normalizeSpeakerName(speaker: string): string {
    const regexAT = /(Agente telefónico|A.T|Agente Telefónico)|AT|A.T./i;
    const regexC = /(Cliente|C|Cliente \(C\))/i;
  
    if (regexAT.test(speaker)) {
      return 'AT';
    } else if (regexC.test(speaker)) {
      return 'C';
    }
  
    return speaker; // Si no hay coincidencia, se devuelve el mismo nombre
  }

  splitIntoWords(sentence: string): string[] {
    return sentence.split(/\s+/);
  }

  filterChat(e: any) {
    const coincidence = e.target.value;
    if(coincidence.length === 0 ) {
      this.search = false
    } else {
      this.search = true;
      let stringChat: any = [];
      const regex = new RegExp(coincidence, 'i');
  
      this.conversation.forEach((message: any) => {
        const stringMessage = JSON.stringify(message);
        
        stringChat.push(stringMessage)
      });
      this.filteredChat = stringChat.filter((convertation: any)=> regex.test(convertation));
      this.showArray()
    }
  }

  showArray() {
    this.filteredChatObject = [];
    this.filteredChat.forEach( (chat: any) => {
      const newChat = JSON.parse(chat);
      this.filteredChatObject.push(newChat)
    })
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }

  redirectAnalizar() {
    this.router.navigate(['/mariana/analizar']);
  }

  redirectAsignacion() {
    this.router.navigate(['/asignacion']);
  }

  redirectIndividual() {
    this.router.navigate(['/asignacion/individual', this.idAnalista]);
  }

  formateaSubcategoria(cadena: string) {
    cadena = cadena.replace(/\s/g, '_');
    return cadena;
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }

}
