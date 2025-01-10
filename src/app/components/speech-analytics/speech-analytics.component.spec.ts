import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechAnalyticsComponent } from './speech-analytics.component';

describe('SpeechAnalyticsComponent', () => {
  let component: SpeechAnalyticsComponent;
  let fixture: ComponentFixture<SpeechAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeechAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
