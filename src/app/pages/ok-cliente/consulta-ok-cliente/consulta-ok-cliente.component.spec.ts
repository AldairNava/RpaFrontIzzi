import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaOkClienteComponent } from './consulta-ok-cliente.component';

describe('ConsultaOkClienteComponent', () => {
  let component: ConsultaOkClienteComponent;
  let fixture: ComponentFixture<ConsultaOkClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaOkClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaOkClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
