import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditionalFormPageRoutingModule } from './delivery-form-routing.module';

import { DeliveryFormPage } from './delivery-form.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AdditionalFormPageRoutingModule,
    SharedModule
  ],
  declarations: [DeliveryFormPage,],
  providers:[Dialogs],
})
export class AdditionalFormPageModule {}
