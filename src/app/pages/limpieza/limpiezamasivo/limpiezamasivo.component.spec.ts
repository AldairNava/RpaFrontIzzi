import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimpiezamasivoComponent } from './limpiezamasivo.component';

describe('LimpiezamasivoComponent', () => {
  let component: LimpiezamasivoComponent;
  let fixture: ComponentFixture<LimpiezamasivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimpiezamasivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimpiezamasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
