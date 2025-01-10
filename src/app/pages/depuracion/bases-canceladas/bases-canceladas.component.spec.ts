import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasesCanceladasComponent } from './bases-canceladas.component';

describe('BasesCanceladasComponent', () => {
  let component: BasesCanceladasComponent;
  let fixture: ComponentFixture<BasesCanceladasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasesCanceladasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasesCanceladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
