import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagConfirmacionComponent } from './flag-confirmacion.component';

describe('FlagConfirmacionComponent', () => {
  let component: FlagConfirmacionComponent;
  let fixture: ComponentFixture<FlagConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagConfirmacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlagConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
