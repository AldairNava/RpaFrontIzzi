import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionSolicitudComponent } from './generacion-solicitud.component';

describe('GeneracionSolicitudComponent', () => {
  let component: GeneracionSolicitudComponent;
  let fixture: ComponentFixture<GeneracionSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneracionSolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
