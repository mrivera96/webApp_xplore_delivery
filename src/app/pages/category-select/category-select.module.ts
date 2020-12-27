import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategorySelectPageRoutingModule } from './category-select-routing.module';

import { CategorySelectPage } from './category-select.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategorySelectPageRoutingModule,
    FontAwesomeModule
  ],
  providers:[Dialogs],
  declarations: [CategorySelectPage]
})
export class CategorySelectPageModule {}
