import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaConsultaComponent } from './pantalla-consulta.component';

describe('PantallaConsultaComponent', () => {
  let component: PantallaConsultaComponent;
  let fixture: ComponentFixture<PantallaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantallaConsultaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
