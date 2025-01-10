import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'bases-canceladas',
  templateUrl: './bases-canceladas.component.html',
  styleUrls: ['./bases-canceladas.component.scss']
})
export class BasesCanceladasComponent implements OnInit {
  spinner:boolean=false;
  button:boolean=true;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Comentarios',
    'Compañía',
    'Creado',
    'Estado',
    'Hub',
    'Motivo de la orden',
    'Nodo',
    'Nº de cuenta',
    'Nº de orden',
    'Tipo'
  ];
  pdfContent:any;
  tabla:boolean=false;
  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }
  ngOnInit(): void {
  }
  readExcel(event:any){
    let file = event.target.files[0];
    let ultimo = file.name.split('.');
    if(ultimo[ultimo.length-1] != 'xlsx'){
       this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'La extensión del archivo es incorrecta',
        detail: 'Ingresa un archivo con extensión XLSX!!',
      });
    }else if(ultimo[ultimo.length-1] == 'xlsx'){
      let fileReader = new FileReader();
      var pattern = /[\^*@!"#$%&/()=?¡!¿'\\]/gi;
      fileReader.readAsBinaryString(file);
      fileReader.onload= (e)=>{
        var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true })
        var sheetNames =  workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]],{defval: ''});
        let count=0;
        for(let [key,value] of Object.entries(this.ExcelData[0])){
          for(let i = 0 ; i<this.headers.length;i++){
            if(key == this.headers[i]){
              count++;
            }  
          }
        }
        if(count == 10){
          Object.keys(this.ExcelData).forEach(key => {
            this.ExcelData[key]["Status"]='Registro pendiente';
            this.ExcelData[key]["Cve_usuario"]=this.usuario.email;
            this.ExcelData[key]["Procesando"]="0";
            this.ExcelData[key]["IP"]="";
            this.ExcelData[key]["Fecha_Carga"]=moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
            let aa =`${this.ExcelData[key]["Nº de cuenta"]}`;
            this.ExcelData[key]["Nº de cuenta"]=aa;
            let b = `${this.ExcelData[key]["Compañía"]}`;
            this.ExcelData[key]["Compañía"]=b;
            var excelNumber = this.ExcelData[key]["Creado"];
            var date = new Date((excelNumber - 25569) * 86400 * 1000);
            let a = moment(date).format('yyyy-MM-DD HH:mm:ss');
            this.ExcelData[key]["Creado"]=a;
            delete this.ExcelData[key][" Mensualidad total "];
            delete this.ExcelData[key]["% de descuento"];
            delete this.ExcelData[key]["."];
            delete this.ExcelData[key]["Activo"];
            delete this.ExcelData[key]["Apellidos"];
            delete this.ExcelData[key]["Aplica Tablet"];
            delete this.ExcelData[key]["Aprobado"];
            delete this.ExcelData[key]["Aprobado por"];
            delete this.ExcelData[key]["CM DS CER"];
            delete this.ExcelData[key]["CM US CER"];
            delete this.ExcelData[key]["Canal de Ingreso"];
            delete this.ExcelData[key]["Centro"];
            delete this.ExcelData[key]["Cerrado"];
            delete this.ExcelData[key]["Clave Vendedor"];
            delete this.ExcelData[key]["Clave del Tecnico Principal"];
            delete this.ExcelData[key]["Codigo de Escenario"];
            delete this.ExcelData[key]["Completada Por"];
            delete this.ExcelData[key]["Confirmación de Instalacion"];
            delete this.ExcelData[key]["Creado por"];
            delete this.ExcelData[key]["Cta. Especial"];
            delete this.ExcelData[key]["Cuenta de facturación"];
            delete this.ExcelData[key]["Código de tipo de orden"];
            delete this.ExcelData[key]["Dirección"];
            delete this.ExcelData[key]["Documento de prueba"];
            delete this.ExcelData[key]["Enviada Por"];
            delete this.ExcelData[key]["Equipo"];
            delete this.ExcelData[key]["Estado Admision"];
            delete this.ExcelData[key]["Estado de asignación de crédito"];
            delete this.ExcelData[key]["Estado en fecha"];
            delete this.ExcelData[key]["Evento"];
            delete this.ExcelData[key]["FD"];
            delete this.ExcelData[key]["Falla General Asociada"];
            delete this.ExcelData[key]["Fecha Admision"];
            delete this.ExcelData[key]["Fecha de la orden"];
            delete this.ExcelData[key]["Fecha solicitada"];
            delete this.ExcelData[key]["Lista de impuestos"];
            delete this.ExcelData[key]["Lista de precios"];
            delete this.ExcelData[key]["Moneda"];
            delete this.ExcelData[key]["Motivo de la cancelacion"];
            delete this.ExcelData[key]["Motivo de reprogramacion"];
            delete this.ExcelData[key]["No. Programaciones"];
            delete this.ExcelData[key]["No. Telefono principal"];
            delete this.ExcelData[key]["No. VTS"];
            delete this.ExcelData[key]["Nombre"];
            delete this.ExcelData[key]["OPC"];
            delete this.ExcelData[key]["OS"];
            delete this.ExcelData[key]["Orden de Pedido"];
            delete this.ExcelData[key]["Orden de Portabilidad"];
            delete this.ExcelData[key]["Organización"];
            delete this.ExcelData[key]["Prioridad"];
            delete this.ExcelData[key]["Puntos Tecnicos"];
            delete this.ExcelData[key]["RX DS"];
            delete this.ExcelData[key]["Rama"];
            delete this.ExcelData[key]["Referido"];
            delete this.ExcelData[key]["Revisión"];
            delete this.ExcelData[key]["SNR DS"];
            delete this.ExcelData[key]["SNR UP"];
            delete this.ExcelData[key]["Sistema"];
            delete this.ExcelData[key]["Sub-Estado"];
            delete this.ExcelData[key]["TX UP"];
            delete this.ExcelData[key]["Telefono 1"];
            delete this.ExcelData[key]["Telefono 2"];
            delete this.ExcelData[key]["Telefono 3"];
            delete this.ExcelData[key]["Telefono 4"];
            delete this.ExcelData[key]["Telefono 5"];
            delete this.ExcelData[key]["Telefono 6"];
            delete this.ExcelData[key]["Teléfonos"];
            delete this.ExcelData[key]["Tipo EMTA"];
            delete this.ExcelData[key]["Tipo de Cuenta"];
            delete this.ExcelData[key]["Total de CNR"];
            delete this.ExcelData[key]["Transferido al libro de trabajo de transacciones"];
            delete this.ExcelData[key]["Ultima Modificacion"];
            delete this.ExcelData[key]["Ultima Modificacion Por"];
            delete this.ExcelData[key]["__EMPTY"];
            delete this.ExcelData[key]["__EMPTY_1"];
            delete this.ExcelData[key]["__EMPTY_2"];
            delete this.ExcelData[key]["__EMPTY_3"];
            delete this.ExcelData[key]["__EMPTY_4"];
          });   
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Exito!!!',
            detail: 'El archivo se a cargado completamente!!!',
          });
          this.button=false;   
          this.tabla=true;
          console.log(this.ExcelData)
        }else{
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El formato del archivo es incorrecto!!!',
          });
        }

        


  
      }
    }

  }


  saveExcel() {
    this.cors.post('EjecucionDepuracion/InsertarBasesCanceladasExcel',this.ExcelData).then((response) => {
      // console.log(response)
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Importado',
        detail: 'Correctamente!!',
      }); 
    }).catch((error) => {
      console.log(error)
      // this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrio un Erro intentalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
    })
    
    this.button=true;
    this.tabla=false;

  }

}
