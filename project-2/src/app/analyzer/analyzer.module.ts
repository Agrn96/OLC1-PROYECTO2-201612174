import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyzerRoutingModule } from './analyzer-routing.module';
import { AnalyzerComponent } from './analyzer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AnalyzerComponent],
  imports: [CommonModule, AnalyzerRoutingModule, FormsModule],
})
export class AnalyzerModule {}
