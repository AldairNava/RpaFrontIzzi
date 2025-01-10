import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionIndividualComponent } from './asignacion-individual.component';

describe('AsignacionIndividualComponent', () => {
  let component: AsignacionIndividualComponent;
  let fixture: ComponentFixture<AsignacionIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionIndividualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignacionIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
