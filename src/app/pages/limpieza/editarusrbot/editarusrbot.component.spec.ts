import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarusrbotComponent } from './editarusrbot.component';

describe('EditarusrbotComponent', () => {
  let component: EditarusrbotComponent;
  let fixture: ComponentFixture<EditarusrbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarusrbotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarusrbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
