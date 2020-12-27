import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SignInModalPageRoutingModule } from './sign-in-routing.module';

import { SignInPage } from './sign-in.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignInModalPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[Dialogs],
  declarations: [SignInPage]
})
export class SignInModalPageModule {}
