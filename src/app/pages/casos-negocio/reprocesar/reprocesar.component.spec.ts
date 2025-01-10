import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesarComponent } from './reprocesar.component';

describe('ReprocesarComponent', () => {
  let component: ReprocesarComponent;
  let fixture: ComponentFixture<ReprocesarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocesarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
