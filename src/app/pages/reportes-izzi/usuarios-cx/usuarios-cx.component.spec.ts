import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosCXComponent } from './usuarios-cx.component';

describe('UsuariosCXComponent', () => {
  let component: UsuariosCXComponent;
  let fixture: ComponentFixture<UsuariosCXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosCXComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosCXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
