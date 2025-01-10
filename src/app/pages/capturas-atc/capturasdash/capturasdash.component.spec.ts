import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturasdashComponent } from './capturasdash.component';

describe('CapturasdashComponent', () => {
  let component: CapturasdashComponent;
  let fixture: ComponentFixture<CapturasdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapturasdashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapturasdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
