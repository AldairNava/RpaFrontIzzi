import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'recuperadores',
  templateUrl: './recuperadores.component.html',
  styleUrls: ['./recuperadores.component.scss']
})
export class RecuperadoresComponent implements OnInit {

  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'JEFE REGIONAL',
    'REGIÓN OPERATIVA',
    'REGIÓN COMERCIAL',
    'CIUDAD',
    'UBICACIÓN / CERCO',
    'DIRECCIÓN',
    '# DE PLAZA',
    'ESTATUS',
    'PUESTO',
    'SKILL',
    'NOMINERA',
    'VALOR ($)',
    'NO EMPLEADO',
    'NOMBRE (S)',
    'APELLIDO PAT',
    'APELLIDO MAT',
    'CODIGO EMPLEADO',
    'ID SUCCES F',
    'USUARIO RED',
    'EMAIL IZZI',
    'PI SIEBEL',
    'ALMACEN SAP',
    'FECHA INGRESO',
    'FECHA NACIMIENTO',
    'HORARIO',
    'DIA DESCANSO',
    'FECHA BAJA',
    'MOTIVO BAJA',
    'COMENTARIO (BAJA)',
    'USUARIO UNICO',
    'ID ORDINARIO',
    'ID ESPECIAL RX',
    'ED ESPECIAL RE EQ',
    'ID SWAT',
    'ID OPERATIVO',
    'ID HEAVY USERS',
    'ID ALESTRA',
    'ID EMPRESARIAL',
    'UNIFORME',
    'CASCO',
    'BOTAS MOT',
    'ESTATUS CASCO',
    'TALLA CHAMARRA',
    'TALLA IMPERMEABLE',
    'TALLA PANTALON',
    'TALLA CAMISA',
    'TALLA BOTAS',
    'COMENTARIOS ROPA',
    'TIPO UNIDAD',
    'ESTATUS UNIDAD',
    'FECHA INACTIVIDAD',
    'MOTIVO INACTIVIDAD',
    'FECHA PROMESA DE ENTREGA',
    'TIENE SEGURO?',
    'CONDICIONES GRAL',
    'MARCA',
    'MODELO',
    'AÑO',
    'SERIE',
    'PLACAS',
    'NO ECO',
    'KM',
    '# TARJETA GASOL',
    'TARJETA CIRCULACION',
    'PROPIA / PRESTADA',
    'COMENTARIOS',
    'UNIDAD PROVISIONAL',
    'TIPO EQUIPO',
    'PROVEEDOR',
    'ACTIVO / INACTIVO',
    'MOTIVO INACTIVIDAD',
    'TIPO DAÑO',
    'ESTADO EQUIPO',
    'MARCA EQUIPO',
    'IMEI EQUIPO',
    'NO TELEFONO',
    'NO SIM',
    'EQUIPO PROVISIONAL',
    'COMENTARIO',
  ];
  button:boolean=true;
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
        let sheet = workBook.Sheets[sheetNames[0]];
        if (sheet && sheet['!ref']) {
          let range = XLSX.utils.decode_range(sheet['!ref']);
          range.s.r = 4;
          sheet['!ref'] = XLSX.utils.encode_range(range);
          this.ExcelData = XLSX.utils.sheet_to_json(sheet, {defval: ''});
        }
        let extraHeaders = [];
        if (this.ExcelData && this.ExcelData[0]) {
          for(let [key,value] of Object.entries(this.ExcelData[0])){
            if(!this.headers.includes(key)){
              extraHeaders.push(key);
            }
          }
        }
        if(extraHeaders.length > 0){
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo contiene ' + extraHeaders.length + ' columnas de más: (' + extraHeaders.join(', ') + ')',
          });
        }else if(Object.keys(this.ExcelData[0]).length == this.headers.length){
          Object.keys(this.ExcelData).forEach(key => {
            this.ExcelData[key]["Status"]='Registro pendiente';
            this.ExcelData[key]["Cve_usuario"]=this.usuario.email;
            this.ExcelData[key]["Procesando"]="0";
            this.ExcelData[key]["prioridad"]="0";
            this.ExcelData[key]["IP"]="";
            this.ExcelData[key]["fechaCaptura"]=moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
            let a =moment(this.ExcelData[key]["Fecha de apertura"]).format('yyyy-MM-DD hh:mm:ss');
            this.ExcelData[key]["Fecha de apertura"]=a;
          });   
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Exito!!!',
            detail: 'El archivo se a cargado completamente!!!',
          });
          this.tabla=true;
          this.button=false;
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
    this.cors.post('AjustesNotDone/InsertarBasesAjustesCasosNegocioCobranza',this.ExcelData).then((response) => {
      // // console.log(response)
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Importado',
        detail: 'Correctamente!!',
      }); 
    }).catch((error) => {
      // console.log(error)
      // this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrio un Erro intentalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
    })
    this.tabla=false;
    this.button=true;
    

  }
  dateFormat(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }


}

