import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendingReservationsPageRoutingModule } from './pending-reservations-routing.module';

import { PendingReservationsPage } from './pending-reservations.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingReservationsPageRoutingModule
  ],
  providers:[Dialogs],
  declarations: [PendingReservationsPage]
})
export class PendingReservationsPageModule {}
