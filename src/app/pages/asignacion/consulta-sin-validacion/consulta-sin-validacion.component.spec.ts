import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaSinValidacionComponent } from './consulta-sin-validacion.component';

describe('ConsultaSinValidacionComponent', () => {
  let component: ConsultaSinValidacionComponent;
  let fixture: ComponentFixture<ConsultaSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaSinValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
