import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioEsquemaComponent } from './cambio-esquema.component';

describe('CambioEsquemaComponent', () => {
  let component: CambioEsquemaComponent;
  let fixture: ComponentFixture<CambioEsquemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioEsquemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioEsquemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
