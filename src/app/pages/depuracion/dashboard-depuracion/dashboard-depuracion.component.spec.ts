import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDepuracionComponent } from './dashboard-depuracion.component';

describe('DashboardDepuracionComponent', () => {
  let component: DashboardDepuracionComponent;
  let fixture: ComponentFixture<DashboardDepuracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDepuracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDepuracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
