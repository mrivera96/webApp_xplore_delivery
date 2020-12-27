import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAdressPageRoutingModule } from './edit-address-routing.module';

import { EditAddressPage } from './edit-address.page';
import {SharedModule} from '../../shared/shared.module';
import {Dialogs} from '@ionic-native/dialogs/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditAdressPageRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
  declarations: [EditAddressPage],
    providers:[Dialogs]
})
export class EditAdressPageModule {}
