import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosCCComponent } from './archivos-cc.component';

describe('ArchivosCCComponent', () => {
  let component: ArchivosCCComponent;
  let fixture: ComponentFixture<ArchivosCCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosCCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivosCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
