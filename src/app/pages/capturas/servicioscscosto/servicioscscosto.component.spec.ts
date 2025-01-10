import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioscscostoComponent } from './servicioscscosto.component';

describe('ServicioscscostoComponent', () => {
  let component: ServicioscscostoComponent;
  let fixture: ComponentFixture<ServicioscscostoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioscscostoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioscscostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
