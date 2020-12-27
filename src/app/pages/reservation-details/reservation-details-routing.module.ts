import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationDetailsPage } from './reservation-details.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailsPageRoutingModule {}
