import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';
moment.lang('es');
import { CorsService } from '@services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'skyOrquestador';
  private intervalSubscription!: Subscription;



  constructor(private router: Router,private cors: CorsService){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.startInterval();
      }
    });

  }

  ngOnInit(): void {
    // this.getUsersContraChange();
    // this.todoEnCero();
  }
  
  startInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    
    this.intervalSubscription = interval(300000).subscribe(() => {
      let a = moment().format('HH:mm:ss');
      if(a.substring(0,2) == '09'){
        this.getUsersContraChange();
      }

      if(a.substring(0,2) == '10'){
        this.todoEnCero();
      }

    });
  }

  getUsersContraChange(){
    this.cors.get('Bots/validarContrasenasBotsIzzi',{ }).then((response) => {
      // console.log(response)
      for(let i =0;i<response.length;i++){
        if(response[i].correoUltimodia == "0"){
          if(response[i].diasPasadosRestantes == 1){
            let a ={
              diasPasadosRestantes : response[i].diasPasadosRestantes,
              usuario: response[i].usuario,
              password: response[i].password,
              updateAt:moment(response[i].updateAt).format('LL')
            }
            this.cors.post('Bots/EnviarContrasenasBotsIzzi',a).then((response1) => {
              console.log(response1)
              this.cors.get(`Bots/updateCorreoSend`,{
              valor:"1",
              id:response[i].id
              }).then((response2) => {
                console.log(response2)
          
              }).catch((error) => {
                  console.log(error)
              })
    
        
            }).catch((error) => {
                console.log(error)
            })
          }
        }
      }
    }).catch((error) => {
        console.log(error)
    })

  }
  

  todoEnCero(){
    this.cors.get('Bots/validarContrasenasBotsIzzi',{ }).then((response) => {
      // console.log(response)
      for(let i =0;i<response.length;i++){
        this.cors.get(`Bots/updateCorreoSend`,{
          valor:"0",
          id:response[i].id
          }).then((response2) => {
            console.log(response2)
      
          }).catch((error) => {
              console.log(error)
          })
      }
    }).catch((error) => {
        console.log(error)
    })
  }














  
}
