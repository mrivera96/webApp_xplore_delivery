import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAdressPageRoutingModule } from './create-adress-routing.module';

import { CreateAdressPage } from './create-adress.page';
import {SharedModule} from '../../shared/shared.module';
import {Dialogs} from '@ionic-native/dialogs/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateAdressPageRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    providers:[Dialogs],
  declarations: [CreateAdressPage]
})
export class CreateAdressPageModule {}
