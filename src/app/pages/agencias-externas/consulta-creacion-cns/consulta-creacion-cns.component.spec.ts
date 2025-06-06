import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCreacionCNsComponent } from './consulta-creacion-cns.component';

describe('ConsultaCreacionCNsComponent', () => {
  let component: ConsultaCreacionCNsComponent;
  let fixture: ComponentFixture<ConsultaCreacionCNsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaCreacionCNsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaCreacionCNsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
