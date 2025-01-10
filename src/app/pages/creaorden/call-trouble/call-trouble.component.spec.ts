import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallTroubleComponent } from './call-trouble.component';

describe('CallTroubleComponent', () => {
  let component: CallTroubleComponent;
  let fixture: ComponentFixture<CallTroubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallTroubleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallTroubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
