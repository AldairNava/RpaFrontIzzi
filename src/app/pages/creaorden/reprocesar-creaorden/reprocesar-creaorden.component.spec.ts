import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesarCreaordenComponent } from './reprocesar-creaorden.component';

describe('ReprocesarCreaordenComponent', () => {
  let component: ReprocesarCreaordenComponent;
  let fixture: ComponentFixture<ReprocesarCreaordenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesarCreaordenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocesarCreaordenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
