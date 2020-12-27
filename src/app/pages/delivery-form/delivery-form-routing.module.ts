import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdditionalFormPage } from './additional-form.page';

const routes: Routes = [
  {
    path: '',
    component: AdditionalFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalFormPageRoutingModule {}
