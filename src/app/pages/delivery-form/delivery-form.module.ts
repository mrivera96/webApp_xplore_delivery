import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditionalFormPageRoutingModule } from './additional-form-routing.module';

import { AdditionalFormPage } from './additional-form.page';
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
  declarations: [AdditionalFormPage,],
  providers:[Dialogs],
})
export class AdditionalFormPageModule {}
