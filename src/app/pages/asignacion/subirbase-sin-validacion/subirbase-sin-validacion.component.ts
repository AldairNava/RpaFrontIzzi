import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
  selector: 'subirbase-sin-validacion',
  templateUrl: './subirbase-sin-validacion.component.html',
  styleUrls: ['./subirbase-sin-validacion.component.scss']
})
export class SubirbaseSinValidacionComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Cuenta',
    'Motivo ajuste',
    'Comentario ajuste',
    'Cantidad a ajustar',
    'Tipo de Ajuste',
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
        // var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true, raw: true })
        var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true })
        var sheetNames =  workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]],{defval: ''});
        // console.log(this.ExcelData)
        
        let count=0;
        for(let [key,value] of Object.entries(this.ExcelData[0])){
          // console.log("Esto es cabezera",key)
          for(let i = 0 ; i<this.headers.length;i++){
            if(key.toUpperCase() == this.headers[i].toUpperCase()){
              // console.log(this.headers[i])
              count++;
            }  
          }
        }
        if(count == 5){
          let moti=0;
          let come=0;
          let canti=0;
          let tipo=0;
          let regex = /^[a-zA-Z0-9% ]+$/;
          let regex1 = /^[0-9.]+$/;
          for(let i =0 ; i<this.ExcelData.length;i++){
            if(this.ExcelData[i]['Motivo ajuste'].toUpperCase() !== 'CONVENIO DE COBRANZA' && this.ExcelData[i]['Motivo ajuste'].toUpperCase() !== 'CARGO POR PAGO EXTEMPORANEO'){
              moti++;
            }
            if(!regex.test(this.ExcelData[i]['Comentario ajuste'])){
              come++;
            }
            if(!regex1.test(this.ExcelData[i]['Cantidad a ajustar'])){
              canti++;
            }
            if(this.ExcelData[i]['Tipo de Ajuste'].toLowerCase() != 'a favor' && this.ExcelData[i]['Tipo de Ajuste'].toLowerCase() != 'en contra'){
              tipo++;
            }
          }          
          Object.keys(this.ExcelData).forEach(key => {
            if(moti ==0 && come==0 && canti==0 && tipo==0){
              this.ExcelData[key]["Status"]='Registro pendiente';
              
            }else if(moti != 0 || come!=0 || canti!=0 || tipo!=0){
              this.ExcelData[key]["Status"]='Error Base';
            }
            this.ExcelData[key]["Cve_usuario"]=this.usuario.email;
            this.ExcelData[key]["Procesando"]="0";
            this.ExcelData[key]["IP"]="";
            this.ExcelData[key]["fechaCaptura"]=moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');;
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
        // console.log(this.ExcelData)

        


  
      }
    }

  }
  saveExcel() {
    this.cors.post('AjustesNotDone/InsertarBasesAjustesSinValidacion',this.ExcelData).then((response) => {
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
    this.tabla=false;
    this.button=true;
    const inputElement = document.getElementById("file") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }

  }

  dateFormat(value:any){
    // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }


}
