import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterpeterRoutingModule } from './interpeter-routing.module';
import { InterpeterComponent } from './interpeter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InterpeterComponent],
  imports: [CommonModule, InterpeterRoutingModule, FormsModule],
})
export class InterpeterModule {}
