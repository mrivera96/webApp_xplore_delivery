import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAdressesPageRoutingModule } from './my-addresses-routing.module';

import { MyAddressesPage } from './my-addresses.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAdressesPageRoutingModule
  ],
  providers:[Dialogs],
  declarations: [MyAddressesPage]
})
export class MyAdressesPageModule {}
