import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesarCallTroubleComponent } from './reprocesar-call-trouble.component';

describe('ReprocesarCallTroubleComponent', () => {
  let component: ReprocesarCallTroubleComponent;
  let fixture: ComponentFixture<ReprocesarCallTroubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesarCallTroubleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocesarCallTroubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
