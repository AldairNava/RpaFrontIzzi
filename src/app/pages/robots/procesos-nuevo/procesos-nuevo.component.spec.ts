import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosNuevoComponent } from './procesos-nuevo.component';

describe('ProcesosNuevoComponent', () => {
  let component: ProcesosNuevoComponent;
  let fixture: ComponentFixture<ProcesosNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesosNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
