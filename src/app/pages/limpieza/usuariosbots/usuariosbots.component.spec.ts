import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosbotsComponent } from './usuariosbots.component';

describe('UsuariosbotsComponent', () => {
  let component: UsuariosbotsComponent;
  let fixture: ComponentFixture<UsuariosbotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosbotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosbotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
