import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosconfigComponent } from './parametrosconfig.component';

describe('ParametrosconfigComponent', () => {
  let component: ParametrosconfigComponent;
  let fixture: ComponentFixture<ParametrosconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrosconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametrosconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
