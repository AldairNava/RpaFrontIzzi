import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioPaqueteComponent } from './cambio-paquete.component';

describe('CambioPaqueteComponent', () => {
  let component: CambioPaqueteComponent;
  let fixture: ComponentFixture<CambioPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioPaqueteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
