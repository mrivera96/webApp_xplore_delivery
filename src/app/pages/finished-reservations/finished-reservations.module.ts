import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishedReservationsPageRoutingModule } from './finished-reservations-routing.module';

import { FinishedReservationsPage } from './finished-reservations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishedReservationsPageRoutingModule
  ],
  declarations: [FinishedReservationsPage]
})
export class FinishedReservationsPageModule {}
