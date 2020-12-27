import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyReservationsPage } from './my-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: MyReservationsPage,
    children:
      [
      
        {
          path: 'pending-reservations',
          loadChildren: () => import('../pending-reservations/pending-reservations.module').then(m => m.PendingReservationsPageModule)
        },
        {
          path: 'finished-reservations',
          loadChildren: () => import('../finished-reservations/finished-reservations.module').then(m => m.FinishedReservationsPageModule)
        },
        {
          path: '',
          redirectTo: '/my-reservations/finished-reservations',
          pathMatch: 'full'
        }

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyReservationsPageRoutingModule {}
