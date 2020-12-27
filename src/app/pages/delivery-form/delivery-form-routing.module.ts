import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryFormPage } from './delivery-form.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalFormPageRoutingModule {}
