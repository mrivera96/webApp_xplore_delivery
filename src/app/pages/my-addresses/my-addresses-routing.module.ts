import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAdressesPage } from './my-adresses.page';

const routes: Routes = [
  {
    path: '',
    component: MyAdressesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAdressesPageRoutingModule {}
