import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DarkService } from '../../services/darkmode/dark.service';


@Component({
  selector: 'activa-cuenta',
  templateUrl: './activa-cuenta.component.html',
  styleUrls: ['./activa-cuenta.component.scss']
})
export class ActivaCuentaComponent implements OnInit {

  mode: boolean = false;
  activateForm: FormGroup;

  constructor(
    private darkMode: DarkService, 
    private formBuilder: FormBuilder, 
    private http: HttpClient
  ) {
    this.activateForm = this.formBuilder.group({
      email: ['develop@mail.com.mx', [Validators.required, Validators.email]],
      pass: ['master', [Validators.required, Validators.minLength(6)]],
      token: ['1f540e', [Validators.required, Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if(this.activateForm.valid) {
      this.submitActiva();
    }
  }

  submitActiva() {
    this.http.post('http://192.168.51.210/api/UsersController/activar', this.activateForm.value).subscribe(
      (res: any) => {
        if( res.status ) {
          // console.log(res)
        } else {
          
        }




      },
      (err: any) => {
        // console.log(err);
      }
    )
  }

  toggleMode() {
    this.darkMode.toggleDarkMode();

    this.mode = this.darkMode.isDarkModeEnabled();
  }
}
