import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationDetailsPageRoutingModule } from './reservation-details-routing.module';

import { ReservationDetailsPage } from './reservation-details.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationDetailsPageRoutingModule
  ],
  declarations: [ReservationDetailsPage],
  providers:[Dialogs]
})
export class ReservationDetailsPageModule {}
