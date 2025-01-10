import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatizadosComponent } from './automatizados.component';

describe('AutomatizadosComponent', () => {
  let component: AutomatizadosComponent;
  let fixture: ComponentFixture<AutomatizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatizadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
