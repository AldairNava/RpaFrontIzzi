import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCasosNegocioComponent } from './dashboard-casos-negocio.component';

describe('DashboardCasosNegocioComponent', () => {
  let component: DashboardCasosNegocioComponent;
  let fixture: ComponentFixture<DashboardCasosNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCasosNegocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCasosNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
