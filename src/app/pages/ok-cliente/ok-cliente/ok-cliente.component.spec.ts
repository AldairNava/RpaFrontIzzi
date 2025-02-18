import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkClienteComponent } from './ok-cliente.component';

describe('OkClienteComponent', () => {
  let component: OkClienteComponent;
  let fixture: ComponentFixture<OkClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OkClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OkClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
