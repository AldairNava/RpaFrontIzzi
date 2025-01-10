import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesarsinvalidacionComponent } from './reprocesarsinvalidacion.component';

describe('ReprocesarsinvalidacionComponent', () => {
  let component: ReprocesarsinvalidacionComponent;
  let fixture: ComponentFixture<ReprocesarsinvalidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesarsinvalidacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocesarsinvalidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
