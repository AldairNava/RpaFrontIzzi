import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasesDepuradasComponent } from './bases-depuradas.component';

describe('BasesDepuradasComponent', () => {
  let component: BasesDepuradasComponent;
  let fixture: ComponentFixture<BasesDepuradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasesDepuradasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasesDepuradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
