import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'interpeter',
    loadChildren: () =>
      import('./interpeter/interpeter.module').then((m) => m.InterpeterModule),
  },
  {
    path: 'analyzer',
    loadChildren: () =>
      import('./analyzer/analyzer.module').then((m) => m.AnalyzerModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
