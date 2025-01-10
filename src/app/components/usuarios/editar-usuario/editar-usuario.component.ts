import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CorsService } from '../../../services/cors/cors.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  editForm: FormGroup = this.fb.group({});  // Inicializa el formGroup
  userId: string = '';  // Inicializa userId

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cors: CorsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';  // Asigna un valor por defecto si es null
    this.loadUserData(this.userId);

    this.editForm = this.fb.group({
      user: [''],
      email: [''],
      active: [''],
      name: [''],
      rol: [''],
      staff: ['']
    });
  }

  loadUserData(id: string) {
    const data = {
      controlador: 'LoginController',
      metodo: 'getUserById',
      id
    };
    this.cors.post(data).subscribe(
      (res: any) => {
        this.editForm.patchValue(res.data);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  cancelar() {
    this.router.navigate(['/usuarios/dash-usuarios']);
  }

  guardar() {
    const updatedData = this.editForm.value;
    const data = {
      controlador: 'LoginController',
      metodo: 'updateUser',
      id: this.userId,
      ...updatedData
    };
    this.cors.post(data).subscribe(
      (res: any) => {
        this.router.navigate(['/usuarios']);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
