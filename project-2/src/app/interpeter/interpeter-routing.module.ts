import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterpeterComponent } from './interpeter.component';

const routes: Routes = [{ path: '', component: InterpeterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterpeterRoutingModule { }
