import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RAySEComponent } from './ray-se.component';

describe('RAySEComponent', () => {
  let component: RAySEComponent;
  let fixture: ComponentFixture<RAySEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RAySEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RAySEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
