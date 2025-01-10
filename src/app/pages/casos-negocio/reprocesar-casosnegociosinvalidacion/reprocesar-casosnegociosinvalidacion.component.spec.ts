import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesarCasosnegociosinvalidacionComponent } from './reprocesar-casosnegociosinvalidacion.component';

describe('ReprocesarCasosnegociosinvalidacionComponent', () => {
  let component: ReprocesarCasosnegociosinvalidacionComponent;
  let fixture: ComponentFixture<ReprocesarCasosnegociosinvalidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesarCasosnegociosinvalidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocesarCasosnegociosinvalidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
