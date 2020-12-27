import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTransferPageRoutingModule } from './new-transfer-routing.module';

import { NewTransferPage } from './new-transfer.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTransferPageRoutingModule
  ],
  providers:[Dialogs],
  declarations: [NewTransferPage]
})
export class NewTransferPageModule {}
