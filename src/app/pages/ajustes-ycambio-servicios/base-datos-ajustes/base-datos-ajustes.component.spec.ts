import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDatosAjustesComponent } from './base-datos-ajustes.component';

describe('BaseDatosAjustesComponent', () => {
  let component: BaseDatosAjustesComponent;
  let fixture: ComponentFixture<BaseDatosAjustesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDatosAjustesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseDatosAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
