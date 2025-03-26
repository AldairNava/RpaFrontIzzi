import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarNotDoneComponent } from './importar-not-done.component';

describe('ImportarNotDoneComponent', () => {
  let component: ImportarNotDoneComponent;
  let fixture: ComponentFixture<ImportarNotDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarNotDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarNotDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
