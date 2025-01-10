import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReporteFidelizacionComponent } from './dashboard-reporte-fidelizacion.component';

describe('DashboardReporteFidelizacionComponent', () => {
  let component: DashboardReporteFidelizacionComponent;
  let fixture: ComponentFixture<DashboardReporteFidelizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardReporteFidelizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardReporteFidelizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
