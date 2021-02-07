import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCardPageRoutingModule } from './edit-card-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditCardPage } from './edit-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCardPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [EditCardPage]
})
export class EditCardPageModule {}
