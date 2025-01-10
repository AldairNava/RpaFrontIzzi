import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarPlantillasComponent } from './cargar-plantillas.component';

describe('CargarPlantillasComponent', () => {
  let component: CargarPlantillasComponent;
  let fixture: ComponentFixture<CargarPlantillasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargarPlantillasComponent]
    });
    fixture = TestBed.createComponent(CargarPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
