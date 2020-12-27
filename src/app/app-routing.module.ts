import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './guards/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInModalPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'location-select/:action',
    loadChildren: () => import('./pages/location-select/location-select.module').then(m => m.NewTransferPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'category-select/:action',
    loadChildren: () => import('./pages/category-select/category-select.module').then(m => m.CategorySelectPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'delivery-form',
    loadChildren: () => import('./pages/delivery-form/delivery-form.module').then(m => m.AdditionalFormPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'reservation-details/:id',
    loadChildren: () => import('./pages/reservation-details/reservation-details.module').then(m => m.ReservationDetailsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'my-reservations',
    canActivate: [AuthGuardGuard],
    loadChildren: () => import('./pages/my-reservations/my-reservations.module').then(m => m.MyReservationsPageModule),
  },
  {
    path: 'my-addresses',
    loadChildren: () => import('./pages/my-addresses/my-addresses.module').then(m => m.MyAdressesPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-address',
    loadChildren: () => import('./pages/edit-address/edit-address.module').then(m => m.EditAdressPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'create-adress',
    loadChildren: () => import('./pages/create-adress/create-adress.module').then(m => m.CreateAdressPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-info',
    loadChildren: () => import('./pages/edit-info/edit-info.module').then(m => m.EditInfoPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cards',
    loadChildren: () => import('./pages/cards/cards.module').then(m => m.CardsPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'create-card',
    loadChildren: () => import('./pages/create-card/create-card.module').then(m => m.CreateCardPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'edit-card',
    loadChildren: () => import('./pages/edit-card/edit-card.module').then(m => m.EditCardPageModule),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./pages/confirmation-page/confirmation-page.module').then(m => m.ConfirmationPagePageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
