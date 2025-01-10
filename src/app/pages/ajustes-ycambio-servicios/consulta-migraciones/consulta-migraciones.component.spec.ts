import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaMigracionesComponent } from './consulta-migraciones.component';

describe('ConsultaMigracionesComponent', () => {
  let component: ConsultaMigracionesComponent;
  let fixture: ComponentFixture<ConsultaMigracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaMigracionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaMigracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
