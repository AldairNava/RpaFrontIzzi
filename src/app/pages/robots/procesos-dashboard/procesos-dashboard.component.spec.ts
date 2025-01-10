import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosDashboardComponent } from './procesos-dashboard.component';

describe('ProcesosDashboardComponent', () => {
  let component: ProcesosDashboardComponent;
  let fixture: ComponentFixture<ProcesosDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
