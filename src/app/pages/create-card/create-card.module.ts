import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCardPageRoutingModule } from './create-card-routing.module';

import { CreateCardPage } from './create-card.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCardPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [CreateCardPage]
})
export class CreateCardPageModule {}
