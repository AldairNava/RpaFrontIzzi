import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExtraccionComponent } from './dashboard-extraccion.component';

describe('DashboardExtraccionComponent', () => {
  let component: DashboardExtraccionComponent;
  let fixture: ComponentFixture<DashboardExtraccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExtraccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExtraccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
