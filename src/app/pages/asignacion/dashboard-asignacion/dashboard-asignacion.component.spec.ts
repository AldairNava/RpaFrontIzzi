import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAsignacionComponent } from './dashboard-asignacion.component';

describe('DashboardAsignacionComponent', () => {
  let component: DashboardAsignacionComponent;
  let fixture: ComponentFixture<DashboardAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAsignacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
