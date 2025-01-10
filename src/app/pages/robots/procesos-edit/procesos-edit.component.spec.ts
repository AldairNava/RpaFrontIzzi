import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosEditComponent } from './procesos-edit.component';

describe('ProcesosEditComponent', () => {
  let component: ProcesosEditComponent;
  let fixture: ComponentFixture<ProcesosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
