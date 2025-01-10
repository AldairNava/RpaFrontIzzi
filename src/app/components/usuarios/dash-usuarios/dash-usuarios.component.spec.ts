import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUsuariosComponent } from './dash-usuarios.component';

describe('DashUsuariosComponent', () => {
  let component: DashUsuariosComponent;
  let fixture: ComponentFixture<DashUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
