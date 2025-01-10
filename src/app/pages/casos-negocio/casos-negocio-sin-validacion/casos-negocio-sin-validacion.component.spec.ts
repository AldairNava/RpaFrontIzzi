import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosNegocioSinValidacionComponent } from './casos-negocio-sin-validacion.component';

describe('CasosNegocioSinValidacionComponent', () => {
  let component: CasosNegocioSinValidacionComponent;
  let fixture: ComponentFixture<CasosNegocioSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasosNegocioSinValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosNegocioSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
