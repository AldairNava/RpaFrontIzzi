import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { ConfirmationService,Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'limpiezamasivo',
  templateUrl: './limpiezamasivo.component.html',
  styleUrls: ['./limpiezamasivo.component.scss']
})
export class LimpiezamasivoComponent implements OnInit {

button:boolean=true;
  spinner:boolean=false;
  closeModal: boolean = true;
  display: boolean = false;
  enviando: boolean = false;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["falla"]
  msgs: Message[] = [];
  validador = [false];
  TablaSeries:any=[];
  loading: boolean = false
  ExcelData:any=[];
  tabla:boolean=false;
  headers:string[]=[
    'Serie',
    'PUNTO DE INVENTARIO'
  ];
  headers2:string[]=[
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
            for(let i = 0 ; i<this.headers2.length;i++){
              if(key == this.headers2[i]){
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
              detail: 'El formato del archivo es incorrecto 1 !!!',
            });
          }
    
        }
      }
  
    }

  readExcellimpieza(event: any) {
      let file = event.target.files[0];
      let ultimo = file.name.split('.');
      console.log('Inicio de la lectura del archivo:', file.name);
  
      if (ultimo[ultimo.length - 1] != 'xlsx') {
          this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'La extensión del archivo es incorrecta',
              detail: 'Ingresa un archivo con extensión XLSX!!',
          });
          console.log('Error: La extensión del archivo es incorrecta');
      } else if (ultimo[ultimo.length - 1] == 'xlsx') {
          let fileReader = new FileReader();
          fileReader.readAsBinaryString(file);
          fileReader.onload = (e) => {
              var workBook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
              var sheetNames = workBook.SheetNames;
              this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { defval: '' });
              console.log('Lectura del archivo completada con éxito');
              console.log('Datos leídos del archivo:', this.ExcelData);
  
              // Verificar que las columnas 'Serie' y 'PUNTO DE INVENTARIO' estén presentes
              let keys = Object.keys(this.ExcelData[0]);
              if (keys.includes('Serie') && keys.includes('PUNTO DE INVENTARIO')) {
                  // Mostrar los datos que se van a insertar en la consola antes de procesar
                  console.log('Datos que se van a insertar:', this.ExcelData);
  
                  Object.keys(this.ExcelData).forEach(key => {
                      this.ExcelData[key]['Serie'] = this.ExcelData[key]['Serie'] || '';
                      this.ExcelData[key]['PUNTO DE INVENTARIO'] = this.ExcelData[key]['PUNTO DE INVENTARIO'] || '';
                  });
  
                  this.messageService.add({
                      key: 'tst',
                      severity: 'success',
                      summary: 'Éxito!!!',
                      detail: 'El archivo se ha cargado completamente!!!',
                  });
                  console.log('Archivo procesado correctamente');
                  this.button = false;
                  this.tabla = true;
              } else {
                  this.messageService.add({
                      key: 'tst',
                      severity: 'error',
                      summary: 'Error',
                      detail: 'El formato del archivo es incorrecto!!!',
                  });
                  console.log('Error: El formato del archivo es incorrecto');
              }
          };
      }
  }
  

  guardar(){
    console.log(true)
    this.spinner=true;
    this.cors.post('Bots/InsertarExcelSeriesMasivo',this.ExcelData).then((response) => {
      this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Exportado',
        detail: 'Correctamente!!',
      });this.getTablaSeries()
    }).catch((error) => {
      console.log(error)
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
  guardarExclucion(){
    console.log(true)
    this.spinner=true;
    this.cors.post('Bots/InsertarExcelSeriesExclucion',this.ExcelData).then((response) => {
      this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Exportado',
        detail: 'Correctamente!!',
      });this.getTablaSeries()
    }).catch((error) => {
      console.log(error)
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
    console.log('ERROR');
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
    this.cors.get('Bots/ObtenerSeriesxclucion')
    .then((response)=>{
      console.log(response)
      this.TablaSeries = response;
    })
    .catch((err)=>{
      console.log(err)
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
      this.cors.delete(`Bots/EliminarFilaserieExclucion?id=${id}`, 
        {
          "id": id
        }
      ).then((response) => {
        console.log(response);
        const index = this.TablaSeries.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          this.TablaSeries.splice(index, 1);
        }
        this.showToastSuccess(`Se eliminó la fila con información ${serieInfo} correctamente.`)
      }).catch((error) => {
        console.log(error);
        this.showToastError(`No se logró eliminar la fila con información ${serieInfo}`)
      })
    }
  });
}

}
