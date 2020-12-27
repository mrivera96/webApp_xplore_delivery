import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from 'src/app/directives/phone-mask.directive';
import { ExpDateDirective } from '../directives/exp-date.directive';


@NgModule({
  declarations: [PhoneMaskDirective, ExpDateDirective],
  imports: [
    CommonModule
  ],
  exports:[
    PhoneMaskDirective,
    ExpDateDirective
  ]
})
export class SharedModule { }
