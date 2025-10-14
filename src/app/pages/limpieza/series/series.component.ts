import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { ConfirmationService,Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {

  button:boolean=true;
  spinner:boolean=false;
  closeModal: boolean = true;
  display: boolean = false;
  enviando: boolean = false;
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  toClearControls: string[] = ["falla"]
  msgs: Message[] = [];
  validador = [false];
  TablaSeries:any=[];
  loading: boolean = false
  ExcelData:any=[];
  tabla:boolean=false;
  headers:string[]=[
    'serie',
  ];


  constructor(
    private cors: CorsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

  ) {

   }

  ngOnInit(): void {
    this.getTablaSeries();
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
        if(count == 1){
          Object.keys(this.ExcelData).forEach(key => {
            this.ExcelData[key]['serie']= `${this.ExcelData[key]['serie']}`;
          });   
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Exito!!!',
            detail: 'El archivo se a cargado completamente!!!',
          });
          this.button=false;   
          this.tabla=true;
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

  guardar(){
    // console.log(true)
    this.spinner=true;
    this.cors.post('Bots/InsertarExcelSeries',this.ExcelData).then((response) => {
      this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Exportado',
        detail: 'Correctamente!!',
      });this.getTablaSeries()
    }).catch((error) => {
      // console.log(error)
      this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrio un Erro intentalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
    })
    // location.reload();
  }
  showErrorViaToast() {
    // console.log('ERROR');
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Faltan datos',
      detail: 'Ingrese todos todos los campos',
    });
  }
  load(index: number) {
    this.validador[index] = true;
    setTimeout(() => (this.validador[index] = false), 1000);
  }

  getTablaSeries(){
    this.cors.get('Bots/ObtenerSeries')
    .then((response)=>{
      // console.log(response)
      this.TablaSeries = response;
    })
    .catch((err)=>{
      // console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  showToastSuccess(message: string) {
    this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Éxito',
        detail: message
    });
}

showToastError(message: string) {
    this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error',
        detail: message
    });
}


eliminarColumna(id: any){
  const item = this.TablaSeries.find((item: any) => item.id === id);
  const serieInfo = item ? item.serie : 'desconocido';
  
  this.confirmationService.confirm({
    key: 'deleteColumn',
    message: `¿Estás seguro de que quieres eliminar la Serie <strong>${serieInfo}</strong>?`,
    accept: () => {
      this.cors.delete(`Bots/EliminarFilaserie?id=${id}`, 
        {
          "id": id
        }
      ).then((response) => {
        // console.log(response);
        const index = this.TablaSeries.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          this.TablaSeries.splice(index, 1);
        }
        this.showToastSuccess(`Se eliminó la fila con información ${serieInfo} correctamente.`)
      }).catch((error) => {
        // console.log(error);
        this.showToastError(`No se logró eliminar la fila con información ${serieInfo}`)
      })
    }
  });
}

}
