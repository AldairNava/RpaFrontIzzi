import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultacasosNegocioSinValidacionComponent } from './consultacasos-negocio-sin-validacion.component';

describe('ConsultacasosNegocioSinValidacionComponent', () => {
  let component: ConsultacasosNegocioSinValidacionComponent;
  let fixture: ComponentFixture<ConsultacasosNegocioSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultacasosNegocioSinValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultacasosNegocioSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
