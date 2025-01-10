import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolsaDatosComponent } from './bolsa-datos.component';

describe('BolsaDatosComponent', () => {
  let component: BolsaDatosComponent;
  let fixture: ComponentFixture<BolsaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BolsaDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BolsaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
