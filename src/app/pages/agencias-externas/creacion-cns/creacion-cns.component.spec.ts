import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCNsComponent } from './creacion-cns.component';

describe('CreacionCNsComponent', () => {
  let component: CreacionCNsComponent;
  let fixture: ComponentFixture<CreacionCNsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionCNsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionCNsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
