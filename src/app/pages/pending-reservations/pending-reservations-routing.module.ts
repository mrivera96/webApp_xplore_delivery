import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingReservationsPage } from './pending-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: PendingReservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingReservationsPageRoutingModule {}
