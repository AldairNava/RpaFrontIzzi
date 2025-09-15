import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarFlagConfirmacionComponent } from './consultar-flag-confirmacion.component';

describe('ConsultarFlagConfirmacionComponent', () => {
  let component: ConsultarFlagConfirmacionComponent;
  let fixture: ComponentFixture<ConsultarFlagConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarFlagConfirmacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarFlagConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
