import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechAnalyticsComponent } from './speech-analytics.component';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [
    SpeechAnalyticsComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    ProgressBarModule
  ],
  exports: [
    SpeechAnalyticsComponent
  ]
})
export class SpeechAnalyticsModule { }
