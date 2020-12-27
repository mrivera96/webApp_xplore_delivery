import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinishedReservationsPage } from './finished-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: FinishedReservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishedReservationsPageRoutingModule {}
