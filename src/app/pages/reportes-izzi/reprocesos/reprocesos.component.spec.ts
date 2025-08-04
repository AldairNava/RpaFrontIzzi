import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesosComponent } from './reprocesos.component';

describe('ReprocesosComponent', () => {
  let component: ReprocesosComponent;
  let fixture: ComponentFixture<ReprocesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
