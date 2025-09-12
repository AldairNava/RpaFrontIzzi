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
    this.getTableAjustesNotDone();

  }

  getTableAjustesNotDone(){
    this.cors.get('AjustesNotDone/getAjustesNotDone').then((response) => {
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
    const regex=/^[0-9]+( - )?([0-9]+)?$/;
    if(regex.test(this.itemSeleccionado.numero)){
      this.cors.put(`AjustesNotDone/ActualizaAjustesNotDone?id=${this.itemSeleccionado.id}`,this.itemSeleccionado).then((response) => {
        this.visible=false;
        this.getTableAjustesNotDone();
      }).catch((error) => {
        // console.log(error)
      })
  
    }else{
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Solo se permiten Números',
        detail: 'Intentalo nuevamentes',
      });

    }
  }



}
