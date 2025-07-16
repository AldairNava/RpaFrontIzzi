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
            email: [null, Validators.required],
            pWd: [null, Validators.required],
            remember: [null],
        });
    }
    ngOnInit() {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log('Usuario restaurado:', user);
            this.router.navigate(['/izzi-rpacx']);
        }
    }
    

    onSignIn() {
        this.formLogin.markAllAsTouched();
        if(this.formLogin.valid){
            if((this.formLogin.value.email =='administrador' && this.formLogin.value.pWd =='administrador.01')
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
                || (this.formLogin.value.email =='CSuarez' && this.formLogin.value.pWd =='CSuarez_2025')
                || (this.formLogin.value.email =='CSuarez' && this.formLogin.value.pWd =='CSuarez_2025')
                || (this.formLogin.value.email =='dmartinezf' && this.formLogin.value.pWd =='dmartinezf_2025')){
                let a=null;
                if(this.formLogin.value.email =='administrador'){
                    a={
                        "role":"administrador",
                        "firstName":"admin",
                        "lastName":"admin",
                        "email":"administrador@izzi.com.mx"
                    }
                }else if(this.formLogin.value.email =='CSuarez'){ 
                    a={
                        "role":"administrador",
                        "firstName":"Christofer",
                        "lastName":"Suarez",
                        "email":"CSuarez@wincall.com.mx"
                    }
                }else if(this.formLogin.value.email =='usuario1'){ 
                    a={
                        "role":"Reporte",
                        "firstName":"Persona1",
                        "lastName":"Persona1",
                        "email":"usuario1@test.com"
                    }
                }else if(this.formLogin.value.email =='testExtraccion'){
                    a={
                        "role":"Extraccion",
                        "firstName":"extraccion",
                        "lastName":"extraccion",
                        "email":"testExtraccion@test.com"
                    }
                }else if(this.formLogin.value.email =='testDepuracion'){
                    a={
                        "role":"Depuracion",
                        "firstName":"depuracion",
                        "lastName":"depuracion",
                        "email":"testDepuracion@test.com"
                    }
                }else if(this.formLogin.value.email =='testAjustes'){ 
                    a={
                        "role":"Ajustes",
                        "firstName":"Ajustes",
                        "lastName":"Ajustes",
                        "email":"testAjustes@test.com"
                    }
                }else if(this.formLogin.value.email =='testAjustesNotDone'){
                    a={
                        "role":"AjustesNotDone",
                        "firstName":"AjustesNotDone",
                        "lastName":"AjustesNotDone",
                        "email":"AjustesNotDone@test.com"
                    }
                }else if(this.formLogin.value.email =='testAjustes1'){
                    a={
                        "role":"testAjustes1",
                        "firstName":"testAjustes1",
                        "lastName":"testAjustes1",
                        "email":"testAjustes1@test.com"
                    }
                }else if(this.formLogin.value.email =='eBarrera'){ 
                    a={
                        "role":"administrador",
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
                }else if(this.formLogin.value.email =='DRLizbeth'){
                    a={
                        "role":"ACS",
                        "firstName":"Lizbeth",
                        "lastName":"Diaz Rosas",
                        "email":"DRLizbeth@test.com"
                    }
                }else if(this.formLogin.value.email =='LOFabian'){
                    a={
                        "role":"ACS",
                        "firstName":"Fabian",
                        "lastName":"Lira Ortiz",
                        "email":"LOFabian@test.com"
                    }
                }
                else if(this.formLogin.value.email =='dmartinezf'){
                    a={
                        "role":"administrador",
                        "firstName":"David",
                        "lastName":"Martinez Flores",
                        "email":"dmartinezf@izzi.mx"
                    }
                }
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
                        "role":"administrador",
                        "firstName":"Oscar",
                        "lastName":"Marines Huerta",
                        "email":"omartinezh@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='evazquezg'){
                    a={
                        "role":"administrador",
                        "firstName":"Edgar",
                        "lastName":"Vazquez Guzman",
                        "email":"evazquezg@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='oavila'){
                    a={
                        "role":"administrador",
                        "firstName":"Oscar Dennys",
                        "lastName":"Avila Santiago",
                        "email":"oavila@sky.com.mx"
                    }
                }else if(this.formLogin.value.email =='mvillalobos'){
                    a={
                        "role":"administrador",
                        "firstName":"Marco Antonio",
                        "lastName":"Villalobos Gomez",
                        "email":"mvillalobos@sky.com.mx"
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

