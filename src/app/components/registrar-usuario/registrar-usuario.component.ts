import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DarkService } from '../../services/darkmode/dark.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2'
import { nanoid } from 'nanoid';

@Component({
  selector: 'registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent implements OnInit {
  mode: boolean =  false;
  sidebarVisible: boolean = false;
  registroForm: FormGroup;

  invalidPass: boolean = true;
  showInvalid: boolean = false;

  constructor(private darkMode: DarkService, 
              private router: Router, 
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private messageService: MessageService) {
              this.registroForm = this.formBuilder.group({
                name: ['Dav vid', Validators.required],
                email: ['develop@mail.com.mx', [Validators.required, Validators.email]],
                pass: ['master', [Validators.required, Validators.minLength(6)]],
                confirmPass: ['master', [Validators.required, Validators.minLength(6)]],
                user: ''
              });
  }

  ngOnInit(): void {
    const dark = this.darkMode.isDarkModeEnabled();
  }

  toggleMode() {
    this.darkMode.toggleDarkMode();

    this.mode = this.darkMode.isDarkModeEnabled();
  }



  onSubmit() {
    if (this.registroForm.valid) {
      const id = nanoid();
      const shortId = id.substring(0, 5);
      this.registroForm.value.user = `${this.registroForm.value.name}_${shortId}`;
      this.postRegistro();
    } else {
      this.showMessage('warn', 'Aviso', 'Es necesario llenar todos los campos')
    }
  }

  cambiando() {
    if(this.registroForm.value.pass != null && this.registroForm.value.confirmPass != null) {
      if(this.registroForm.value.pass != this.registroForm.value.confirmPass ) {
        this.invalidPass = true;
        this.showInvalid = true;
      } else {
        this.invalidPass = false;
      }
    }
  }

  postRegistro() {
    this.http.post('http://192.168.51.210/api/UsersController/registro', this.registroForm.value).subscribe(
      (res: any) => {
        if(res.status) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'El usuario se ha registrado, revisa tu bandeja de entrada',
            showConfirmButton: false,
            timer: 3000
          })

          this.registroForm.reset();
          this.invalidPass = true;

          setTimeout(() => {
            this.router.navigate(['/activar'])
          }, 3000);
        } else {
          if(res.message) {
            this.showMessage('error', 'Error', `${res.message}`)
          }
        }

      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  marcarCamposInvalidos(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.marcarCamposInvalidos(control);
      }
    });
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }



}
