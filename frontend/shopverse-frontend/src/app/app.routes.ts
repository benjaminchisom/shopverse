import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./pages/sign-in/sign-in').then(m => m.SignIn)
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sign-up/sign-up').then(m => m.SignUp)
  },
   {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account').then(m => m.Account)
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'sign-in'
  }
];
