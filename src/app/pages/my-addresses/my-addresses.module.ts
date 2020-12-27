import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAdressesPageRoutingModule } from './my-adresses-routing.module';

import { MyAdressesPage } from './my-adresses.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAdressesPageRoutingModule
  ],
  providers:[Dialogs],
  declarations: [MyAdressesPage]
})
export class MyAdressesPageModule {}
