import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { environment } from 'environments/environment';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    rememberMe: boolean = false;
    msgs: Message[] = [];
    formLogin: UntypedFormGroup;
    constructor(private messageService: MessageService,private cors: CorsService, private formBuilder: UntypedFormBuilder, private router: Router) {
        this.formLogin = this.formBuilder.group({
            // email: [environment.user, Validators.required],
            // pWd: [environment.password, Validators.required],
            email: [null, Validators.required],
            pWd: [null, Validators.required],
            remember: [null],
        });
    }

    onSignIn() {
        this.formLogin.markAllAsTouched();
        if(this.formLogin.valid){
            if((this.formLogin.value.email =='admin' && this.formLogin.value.pWd =='admin_2023')
                || (this.formLogin.value.email =='usuario1' && this.formLogin.value.pWd =='usuario1_2023')
                || (this.formLogin.value.email =='testExtraccion' && this.formLogin.value.pWd =='testExtraccion_2023')
                || (this.formLogin.value.email =='testDepuracion' && this.formLogin.value.pWd =='testDepuracion_2023') 
                || (this.formLogin.value.email =='testAjustes' && this.formLogin.value.pWd =='testAjustes_2023') 
                || (this.formLogin.value.email =='testAjustesNotDone' && this.formLogin.value.pWd =='testAjustesNotDone_2023') 
                || (this.formLogin.value.email =='testAjustes1' && this.formLogin.value.pWd =='testAjustes1_2023') 
                || (this.formLogin.value.email =='eBarrera' && this.formLogin.value.pWd =='eBarrera_2023') 
                || (this.formLogin.value.email =='testReportes' && this.formLogin.value.pWd =='testReportes_2023')
                || (this.formLogin.value.email =='TMFabiola' && this.formLogin.value.pWd =='TMFabiola_2023')
                || (this.formLogin.value.email =='DRLizbeth' && this.formLogin.value.pWd =='DRLizbeth_2023')
                || (this.formLogin.value.email =='LOFabian' && this.formLogin.value.pWd =='LOFabian_2023')
                // || (this.formLogin.value.email =='Hiram' && this.formLogin.value.pWd =='Hiram_2024')
                || (this.formLogin.value.email =='UsrRecuperacion' && this.formLogin.value.pWd =='Recuperacion_2024')
                || (this.formLogin.value.email =='ICortes' && this.formLogin.value.pWd =='Israel_2024')
                || (this.formLogin.value.email =='omartinezh' && this.formLogin.value.pWd =='omartinezh_2024')
                || (this.formLogin.value.email =='JPalacios' && this.formLogin.value.pWd =='JPalacios_2024')
                || (this.formLogin.value.email =='evazquezg' && this.formLogin.value.pWd =='evazquezg_2024')
                || (this.formLogin.value.email =='oavila' && this.formLogin.value.pWd =='oavila_2024')
                || (this.formLogin.value.email =='mvillalobos' && this.formLogin.value.pWd =='mvillalobos_2024')
                || (this.formLogin.value.email =='alramirezb' && this.formLogin.value.pWd =='alramirezb_2024')){
                let a=null;
                if(this.formLogin.value.email =='admin'){
                    a={
                        "role":"admin",
                        "firstName":"admin",
                        "lastName":"admin",
                        "email":"admin@test.com"
                    }
                }else if(this.formLogin.value.email =='usuario1'){ //reporte fidelizacion reporte
                    a={
                        "role":"Reporte",
                        "firstName":"Persona1",
                        "lastName":"Persona1",
                        "email":"usuario1@test.com"
                    }
                }else if(this.formLogin.value.email =='testExtraccion'){ //reporte extraccion
                    a={
                        "role":"Extraccion",
                        "firstName":"extraccion",
                        "lastName":"extraccion",
                        "email":"testExtraccion@test.com"
                    }
                }else if(this.formLogin.value.email =='testDepuracion'){ //reporte Depuracion
                    a={
                        "role":"Depuracion",
                        "firstName":"depuracion",
                        "lastName":"depuracion",
                        "email":"testDepuracion@test.com"
                    }
                }else if(this.formLogin.value.email =='testAjustes'){ //reporte Depuracion
                    a={
                        "role":"Ajustes",
                        "firstName":"Ajustes",
                        "lastName":"Ajustes",
                        "email":"testAjustes@test.com"
                    }
                }else if(this.formLogin.value.email =='testAjustesNotDone'){ //reporte Depuracion
                    a={
                        "role":"AjustesNotDone",
                        "firstName":"AjustesNotDone",
                        "lastName":"AjustesNotDone",
                        "email":"AjustesNotDone@test.com"
                    }
                }else if(this.formLogin.value.email =='testAjustes1'){ //reporte Depuracion
                    a={
                        "role":"testAjustes1",
                        "firstName":"testAjustes1",
                        "lastName":"testAjustes1",
                        "email":"testAjustes1@test.com"
                    }
                }else if(this.formLogin.value.email =='eBarrera'){ 
                    a={
                        "role":"eBarrera",
                        "firstName":"eBarrera",
                        "lastName":"eBarrera",
                        "email":"eBarrera@test.com"
                    }
                }else if(this.formLogin.value.email =='testReportes'){ 
                    a={
                        "role":"testReportes",
                        "firstName":"testReportes",
                        "lastName":"testReportes",
                        "email":"testReportes@test.com"
                    }
                }else if(this.formLogin.value.email =='TMFabiola'){ //reporte fidelizacion reporte
                    a={
                        "role":"ACS",
                        "firstName":"Fabiola",
                        "lastName":"Torres Marin",
                        "email":"TMFabiola@test.com"
                    }
                }else if(this.formLogin.value.email =='DRLizbeth'){ //reporte fidelizacion reporte
                    a={
                        "role":"ACS",
                        "firstName":"Lizbeth",
                        "lastName":"Diaz Rosas",
                        "email":"DRLizbeth@test.com"
                    }
                }else if(this.formLogin.value.email =='LOFabian'){ //reporte fidelizacion reporte
                    a={
                        "role":"ACS",
                        "firstName":"Fabian",
                        "lastName":"Lira Ortiz",
                        "email":"LOFabian@test.com"
                    }
                }
                // else if(this.formLogin.value.email =='Hiram'){
                //     a={
                //         "role":"admin",
                //         "firstName":"Hiram",
                //         "lastName":"Martinez Herrera",
                //         "email":"IMPatricio@test.com"
                //     }
                // }
                else if(this.formLogin.value.email =='UsrRecuperacion'){
                    a={
                        "role":"recuperadores",
                        "firstName":"Recuperacion",
                        "lastName":"Usuario",
                        "email":"UsrRecuperacion@test.com"
                    }
                }
                else if(this.formLogin.value.email =='ICortes'){
                    a={
                        "role":"Reporte",
                        "firstName":"Israel",
                        "lastName":"Cortes",
                        "email":"ICortes@test.com"
                    }
                }
                else if(this.formLogin.value.email =='JPalacios'){
                    a={
                        "role":"ACS",
                        "firstName":"Javier",
                        "lastName":"Palacios",
                        "email":"JPalacios@test.com"
                    }
                }else if(this.formLogin.value.email =='omartinezh'){
                    a={
                        "role":"admin",
                        "firstName":"Oscar",
                        "lastName":"Marines Huerta",
                        "email":"omartinezh@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='evazquezg'){
                    a={
                        "role":"admin",
                        "firstName":"Edgar",
                        "lastName":"Vazquez Guzman",
                        "email":"evazquezg@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='oavila'){
                    a={
                        "role":"admin",
                        "firstName":"Oscar Dennys",
                        "lastName":"Avila Santiago",
                        "email":"oavila@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='mvillalobos'){
                    a={
                        "role":"admin",
                        "firstName":"Marco Antonio",
                        "lastName":"Villalobos Gomez",
                        "email":"mvillalobos@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='alramirezb'){
                    a={
                        "role":"Reporte",
                        "firstName":"Angeles Lizeth",
                        "lastName":"Ramírez Barrera",
                        "email":"alramirezb@izzi.mx"
                    }
                }
                
                localStorage.setItem( "userData",JSON.stringify(a))   
                this.router.navigate(['/izzi-rpacx']);
    
            }else{
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Usuario o contraseña Invalidos',
                    detail: 'Intentalo Nuevamente!!',
                  });
            }
    
        }
    }
}

