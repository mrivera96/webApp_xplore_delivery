import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTransferPageRoutingModule } from './location-select-routing.module';

import { LocationSelectPage } from './location-select.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTransferPageRoutingModule
  ],
  providers:[Dialogs],
  declarations: [LocationSelectPage]
})
export class NewTransferPageModule {}
