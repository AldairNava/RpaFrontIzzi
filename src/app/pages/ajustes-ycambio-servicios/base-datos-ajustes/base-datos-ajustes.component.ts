import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';


@Component({
  selector: 'base-datos-ajustes',
  templateUrl: './base-datos-ajustes.component.html',
  styleUrls: ['./base-datos-ajustes.component.scss']
})
export class BaseDatosAjustesComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any;
  spinner:boolean=false;
  button:boolean=true;
  headers:string[]=[
    'Caso de negocio',
    'Cierre Estimado',
    'Descripción',
    'Estado',
    'Fecha de apertura',
    'Motivo Cliente',
    'Nº de cuenta'
  ];


  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  readExcel(event: any) {
    let results: any[] = [];
    let count: any = 0;
    let file = event.target.files[0];
    let ultimo = file.name.split('.');

    if (ultimo[ultimo.length - 1] != 'xlsx') {
        this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'La extensión del archivo es incorrecta',
            detail: 'Ingresa un archivo con extensión XLSX!!',
        });
    } else if (ultimo[ultimo.length - 1] == 'xlsx') {
        let fileReader = new FileReader();
        var pattern = /[\^*@!"#$%&/()=?¡!¿'\\]/gi;
        fileReader.readAsBinaryString(file);

        fileReader.onload = (e) => {
            // console.log("Archivo cargado exitosamente");
            var workBook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
            var sheetNames = workBook.SheetNames;
            this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { defval: '' });

            this.ExcelData = this.ExcelData.map((row: any) => {
                if (row['Descripción']) {
                    if (typeof row['Descripción'] === 'string') {
                        row['Descripción'] = row['Descripción'].replace(pattern, '');
                    } else {
                        // console.log("Error: 'Descripción' no es una cadena en la fila:", row);
                    }
                }
                return row;
            });

            let extraHeaders: string[] = [];
            for (let [key, value] of Object.entries(this.ExcelData[0])) {
                // console.log("Verificando encabezado:", key);
                if (this.headers.includes(key)) {
                    count++;
                } else {
                    extraHeaders.push(key);
                }
            }

            // console.log("Cantidad de encabezados coincidentes:", count);
            // console.log("Encabezados adicionales:", extraHeaders);

            if (count == 7) {
                Object.keys(this.ExcelData).forEach(key => {
                    this.ExcelData[key]["Status"] = 'Pendiente';
                    this.ExcelData[key]["Cve_usuario"] = this.usuario.email;
                    this.ExcelData[key]["Procesando"] = "0";
                    this.ExcelData[key]["IP"] = "";
                    this.ExcelData[key]["Fecha_Carga"] = moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
                    this.ExcelData[key]["Motivo"] = this.ExcelData[key]["Descripción"];
                    this.ExcelData[key]["Creado_1"] = this.ExcelData[key]["Fecha de apertura"];
                    this.ExcelData[key]["Vencimiento"] = this.ExcelData[key]["Cierre Estimado"];

                    delete this.ExcelData[key]["Descripción"];
                    delete this.ExcelData[key]["Cierre Estimado"];
                    delete this.ExcelData[key]["Fecha de apertura"];
                    delete this.ExcelData[key][" Resultado en los niveles"];
                    delete this.ExcelData[key]["Actualizado por"];
                    delete this.ExcelData[key]["Categoría"];
                    delete this.ExcelData[key]["Confirmación con el cliente"];
                    delete this.ExcelData[key]["Creado por"];
                    delete this.ExcelData[key]["Estado de Cuenta"];
                    delete this.ExcelData[key]["Falla General Asociada"];
                    delete this.ExcelData[key]["Fecha Solicitud Cliente"];
                    delete this.ExcelData[key]["Fecha de última actualización"];
                    delete this.ExcelData[key]["Fecha de cierre"];
                    delete this.ExcelData[key]["Flag Escalamiento"];
                    delete this.ExcelData[key]["Flag Próxima a Vencer"];
                    delete this.ExcelData[key]["Folio Id Portabilidad"];
                    delete this.ExcelData[key]["Fuente"];
                    delete this.ExcelData[key]["Hub"];
                    delete this.ExcelData[key]["Lista de precios"];
                    delete this.ExcelData[key]["Medio de contacto"];
                    delete this.ExcelData[key]["Motivo de cancelación"];
                    delete this.ExcelData[key]["Motivo de la OS TC SWAT Team"];
                    delete this.ExcelData[key]["Motivo del cierre"];
                    delete this.ExcelData[key]["Motivos"];
                    delete this.ExcelData[key]["NIP de Portabilidad"];
                    delete this.ExcelData[key]["Nodo"];
                    delete this.ExcelData[key]["Prioridad"];
                    delete this.ExcelData[key]["RPT de la cuenta"];
                    delete this.ExcelData[key]["RPT del creador"];
                    delete this.ExcelData[key]["Ramal"];
                    delete this.ExcelData[key]["Recuperacion de Numero Telefonico"];
                    delete this.ExcelData[key]["SWAT Automático"];
                    delete this.ExcelData[key]["Severidad"];
                    delete this.ExcelData[key]["Solución"];
                    delete this.ExcelData[key]["Sub-Estado"];
                    delete this.ExcelData[key]["Subestado de la cuenta"];
                    delete this.ExcelData[key]["Submotivo"];
                    delete this.ExcelData[key]["Ticket de remedy asociado"];
                    delete this.ExcelData[key]["Tiempo Est."];
                    delete this.ExcelData[key]["Tipo de Contribuyente"];
                    delete this.ExcelData[key]["Usuario Responsable"];
                });

                // console.log("ExcelData procesado:", this.ExcelData);

                this.messageService.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Exito!!!',
                    detail: 'El archivo se ha cargado completamente!!!',
                });
                this.button = false;
            } else {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: `El formato del archivo es incorrecto!!! Encabezados adicionales: ${extraHeaders.join(', ')}`,
                });
            }
        }
    }
}




  saveExcel() {
    this.button=true;
    let filteredArray = this.ExcelData.filter((obj:any) => obj['Nº de cuenta']    !== "" && obj['Nº de cuenta'] !== undefined );
    this.cors.post('AjustesCambiosServicios/InsertarBaseDatosAjustesExcel',filteredArray).then((response) => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Exportado',
        detail: 'Correctamente!!',
      }); 
    }).catch((error) => {
      // console.log(error)
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrio un Erro intentalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
    })
    
    

  }


}
