import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Message,MessageService,ConfirmationService,ConfirmEventType } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';

@Component({
  selector: 'reprocesar',
  templateUrl: './reprocesar.component.html',
  styleUrls: ['./reprocesar.component.scss']
})
export class ReprocesarComponent implements OnInit {
  showtable:any=[];
  formReproceso:UntypedFormGroup;
  msgs: Message[] = [];


  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private cors: CorsService,
    private confirmationService: ConfirmationService
  ) {
    this.formReproceso = this.formBuilder.group({
      fecha: [null, Validators.required]
    });
   }

  ngOnInit(): void {
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  dateFormat(value:any){
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }

  getAjustesCasoNotDone(fecha1:any,fecha2:any){
    this.cors.get(`AjustesNotDone/getCasosNotDoneError`,{
      fecha1:fecha1,
      fecha2:fecha2,
    }).then((response) => {
      // console.log(response)
      if(response.length == 0){
        this.showtable = [];
        this.messageService.add({
          key: 'tst',
          severity: 'info',
          summary: 'No hay datos para mostrar',
          detail: '',
        });

      }else{
        this.showtable = response;

      }
    }).catch((error) => {
      console.log(error)
    })

  }

  buscar(){
    if(this.formReproceso.controls['fecha'].value == null || this.formReproceso.controls['fecha']?.value[1] == null){
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Se necesita un rango de fechas',
        detail: 'Intentarlo Nuevamente!!',
      });

    }else{
      let fecha1= moment(this.formReproceso.controls['fecha'].value[0]).format('yyyy-MM-DD');
      let fecha2= moment(this.formReproceso.controls['fecha'].value[1]).format('yyyy-MM-DD');
      this.getAjustesCasoNotDone(fecha1,fecha2);
    }



  }

  reprocesar(item:any){
    this.cors.get(`AjustesNotDone/ActualizarStatusCasoNotDone`,{
      status:item,
      fecha1:moment(this.formReproceso.controls['fecha'].value[0]).format('yyyy-MM-DD'),
      fecha2:moment(this.formReproceso.controls['fecha'].value[1]).format('yyyy-MM-DD')
    }).then((response) => {
      this.showtable = [];
      this.messageService.add({
        key: 'tst',
        severity: 'info',
        summary: `${response[0].message}`,
        detail: '',
      });

    }).catch((error) => {
      console.log(error)
    })
    let fecha1= moment(this.formReproceso.controls['fecha'].value[0]).format('yyyy-MM-DD');
    let fecha2= moment(this.formReproceso.controls['fecha'].value[1]).format('yyyy-MM-DD');
    this.getAjustesCasoNotDone(fecha1,fecha2);
  }

  confirm1(item:any) {
    this.confirmationService.confirm({
        message: `Deseas reprocesar todas las cuentas <br> con el siguiente Estatus: <strong>${item}</strong>?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',     
        accept: () => {
            this.reprocesar(item);
        },
        reject: (type: any) => {
            switch (type as ConfirmEventType) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha sido Rechazado' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Ha sido Cancelado' });
                    break;        
            }
        }

    });
  }
}