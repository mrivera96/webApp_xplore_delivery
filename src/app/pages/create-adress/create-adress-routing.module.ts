import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAdressPage } from './create-adress.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAdressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAdressPageRoutingModule {}
