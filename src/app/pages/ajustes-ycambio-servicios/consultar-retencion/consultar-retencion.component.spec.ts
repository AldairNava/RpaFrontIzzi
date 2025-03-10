import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarRetencionComponent } from './consultar-retencion.component';

describe('ConsultarRetencionComponent', () => {
  let component: ConsultarRetencionComponent;
  let fixture: ComponentFixture<ConsultarRetencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarRetencionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarRetencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
