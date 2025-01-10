import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesIzziDashComponent } from './reportes-izzi-dash.component';

describe('ReportesIzziDashComponent', () => {
  let component: ReportesIzziDashComponent;
  let fixture: ComponentFixture<ReportesIzziDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesIzziDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesIzziDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
