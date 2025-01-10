import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobsComponent } from './hobs.component';

describe('HobsComponent', () => {
  let component: HobsComponent;
  let fixture: ComponentFixture<HobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
