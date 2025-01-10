import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelacionSinValidacionComponent } from './cancelacion-sin-validacion.component';

describe('CancelacionSinValidacionComponent', () => {
  let component: CancelacionSinValidacionComponent;
  let fixture: ComponentFixture<CancelacionSinValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelacionSinValidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelacionSinValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
