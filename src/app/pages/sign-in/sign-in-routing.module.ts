import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInModalPage } from './sign-in-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SignInModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignInModalPageRoutingModule {}
