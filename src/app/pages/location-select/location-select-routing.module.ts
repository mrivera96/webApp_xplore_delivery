import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTransferPage } from './new-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: NewTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTransferPageRoutingModule {}
