import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseNotdoneComponent } from './base-notdone.component';

describe('BaseNotdoneComponent', () => {
  let component: BaseNotdoneComponent;
  let fixture: ComponentFixture<BaseNotdoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseNotdoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseNotdoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
