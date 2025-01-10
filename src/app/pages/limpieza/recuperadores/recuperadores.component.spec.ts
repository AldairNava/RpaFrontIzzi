import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperadoresComponent } from './recuperadores.component';

describe('RecuperadoresComponent', () => {
  let component: RecuperadoresComponent;
  let fixture: ComponentFixture<RecuperadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuperadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
