import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultacancelacionSinValidacionComponent } from './consultacancelacion-sin-validacion.component';

describe('ConsultacancelacionSinValidacionComponent', () => {
  let component: ConsultacancelacionSinValidacionComponent;
  let fixture: ComponentFixture<ConsultacancelacionSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultacancelacionSinValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultacancelacionSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
