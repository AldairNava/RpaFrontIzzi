import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DarkService } from '../../services/darkmode/dark.service';
import { CorsService } from '../../services/cors/cors.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  mode: boolean =  false;
  sidebarVisible: boolean = false;

  loginForm: FormGroup;

  constructor(private darkMode: DarkService,  
    private router: Router, 
    private cors: CorsService,
    private messageService: MessageService,
    private formBuilder: FormBuilder) {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        pass: ['', [Validators.required, Validators.minLength(3)]],
        controlador: ['UsersController'],
        metodo: ['login'],
      });
    }

  ngOnInit(): void {
    const dark = this.darkMode.isDarkModeEnabled();

    if(sessionStorage.getItem('user_id') != null) {
      this.router.navigate(['mariana']);
    }
  }

  toggleMode() {
    this.darkMode.toggleDarkMode();

    this.mode = this.darkMode.isDarkModeEnabled();

    // // console.log(this.mode)
  }

  setSession() {
    if( this.loginForm.valid ) {
      this.postLogin();
    } else {
      this.showMessage('error', 'Error', 'Faltan datos, por favor valida');
    }
  }

  postLogin() {
    this.cors.post(this.loginForm.value).subscribe(
      (res: any) => {
        if(res.status) {
          // console.log(res)
          sessionStorage.setItem('user_id', res.user);
          sessionStorage.setItem('name', res.name);
          sessionStorage.setItem('email', res.email);
          sessionStorage.setItem('rol', res.rol);

          if(res.rol != 'admin') {
            this.router.navigate(['mariana']);

          } else {
            this.router.navigate(['/mariana']);
          }
        } else {
          if(res.message.includes('activa')) {
            this.showMessage('warn', 'Aviso', `${res.message}, contacta al administrador`);
          }
          
          if( res.message.includes('registrado')) {
            this.showMessage('warn', 'Aviso', `${res.message}`);
          } 
          if( res.message.includes('incorrectos')) {
            this.showMessage('warn', 'Aviso', 'Los datos son incorrectos, por favor verifícalos.');
          }
        }

      },
      (err: any) => {
        // console.log(err);
        this.showMessage('error', 'Error', 'No se ha podido establecer conexión con el servicio.');
      }
    )
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }
}
