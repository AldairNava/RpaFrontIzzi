import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefijosComponent } from './prefijos.component';

describe('PrefijosComponent', () => {
  let component: PrefijosComponent;
  let fixture: ComponentFixture<PrefijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrefijosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrefijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
