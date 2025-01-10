import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionOrdenesComponent } from './creacion-ordenes.component';

describe('CreacionOrdenesComponent', () => {
  let component: CreacionOrdenesComponent;
  let fixture: ComponentFixture<CreacionOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionOrdenesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
