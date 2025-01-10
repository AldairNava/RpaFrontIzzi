import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigracionesLinealesComponent } from './migraciones-lineales.component';

describe('MigracionesLinealesComponent', () => {
  let component: MigracionesLinealesComponent;
  let fixture: ComponentFixture<MigracionesLinealesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigracionesLinealesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigracionesLinealesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
