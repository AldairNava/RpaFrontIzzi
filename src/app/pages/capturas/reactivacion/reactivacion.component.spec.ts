import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivacionComponent } from './reactivacion.component';

describe('ReactivacionComponent', () => {
  let component: ReactivacionComponent;
  let fixture: ComponentFixture<ReactivacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactivacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactivacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
