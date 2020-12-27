import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategorySelectPage } from './category-select.page';

const routes: Routes = [
  {
    path: '',
    component: CategorySelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategorySelectPageRoutingModule {}
