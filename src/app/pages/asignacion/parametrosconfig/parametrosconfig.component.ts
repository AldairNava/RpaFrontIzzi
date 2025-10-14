import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';


@Component({
  selector: 'parametrosconfig',
  templateUrl: './parametrosconfig.component.html',
  styleUrls: ['./parametrosconfig.component.scss']
})
export class ParametrosconfigComponent implements OnInit {
  ajustes:any[]=[];
  visible:boolean=false;
  itemSeleccionado: any = {
    tiempoAjuste:"",
    valor:""
  };

  constructor(
    private cors: CorsService,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.getTableAjustesCobranzaTiempo();

  }
  getTableAjustesCobranzaTiempo(){
    this.cors.get('AjustesNotDone/getAjustesTiempoAjuste').then((response) => {
      if(response[0]=='SIN INFO'){
        this.ajustes=[];
      }else{
        this.ajustes=response;
      }
    }).catch((error) => {
      // console.log(error)
    })

  }

  abrirDialogo(item: any) {
    this.itemSeleccionado = item;
    this.visible = true;
  }
  save(){
    // const regex=/^[0-9]+$/;
    const regex=/^[0-9]+( )?(meses)?$/;
    if(regex.test(this.itemSeleccionado.valor)){
      this.cors.put(`AjustesNotDone/ActualizaAjustesTiempoAjuste?id=${this.itemSeleccionado.id}`,this.itemSeleccionado).then((response) => {
        this.visible=false;
        this.getTableAjustesCobranzaTiempo()
      }).catch((error) => {
        // console.log(error)
      })
  
    }else{
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Solo se permiten Números y al final (meses)',
        detail: 'Intentalo nuevamentes',
      });

    }
  }


}
