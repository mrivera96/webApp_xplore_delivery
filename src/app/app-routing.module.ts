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
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in-modal/sign-in-modal.module').then( m => m.SignInModalPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'location-select/:action',
    loadChildren: () => import('./pages/new-transfer/new-transfer.module').then( m => m.NewTransferPageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'category-select/:action',
    loadChildren: () => import('./pages/category-select/category-select.module').then( m => m.CategorySelectPageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'finish-traslate',
    loadChildren: () => import('./pages/finish-traslate/finish-traslate.module').then( m => m.FinishTraslatePageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'additional-form',
    loadChildren: () => import('./pages/additional-form/additional-form.module').then( m => m.AdditionalFormPageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'reservation-details/:id',
    loadChildren: () => import('./pages/reservation-details/reservation-details.module').then( m => m.ReservationDetailsPageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'my-reservations',
    loadChildren: () => import('./pages/my-reservations/my-reservations.module').then( m => m.MyReservationsPageModule),
    canActivate:[AuthGuardGuard]
  },
  {
    path: 'my-adresses',
    loadChildren: () => import('./pages/my-adresses/my-adresses.module').then( m => m.MyAdressesPageModule)
  },
  {
    path: 'edit-adress',
    loadChildren: () => import('./pages/edit-adress/edit-adress.module').then( m => m.EditAdressPageModule)
  },
  {
    path: 'create-adress',
    loadChildren: () => import('./pages/create-adress/create-adress.module').then( m => m.CreateAdressPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
