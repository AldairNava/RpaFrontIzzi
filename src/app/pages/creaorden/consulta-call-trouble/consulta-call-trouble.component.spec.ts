import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCallTroubleComponent } from './consulta-call-trouble.component';

describe('ConsultaCallTroubleComponent', () => {
  let component: ConsultaCallTroubleComponent;
  let fixture: ComponentFixture<ConsultaCallTroubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaCallTroubleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaCallTroubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
