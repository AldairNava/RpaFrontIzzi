import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallasDepuracionComponent } from './fallas-depuracion.component';

describe('FallasDepuracionComponent', () => {
  let component: FallasDepuracionComponent;
  let fixture: ComponentFixture<FallasDepuracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FallasDepuracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FallasDepuracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
