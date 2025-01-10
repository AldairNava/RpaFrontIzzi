import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirbaseSinValidacionComponent } from './subirbase-sin-validacion.component';

describe('SubirbaseSinValidacionComponent', () => {
  let component: SubirbaseSinValidacionComponent;
  let fixture: ComponentFixture<SubirbaseSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubirbaseSinValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirbaseSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
