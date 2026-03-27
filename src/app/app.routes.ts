import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login').then(m => m.Login) },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/dashboard').then(m => m.Dashboard) },
      { path: 'inventory', loadComponent: () => import('./pages/inventory').then(m => m.Inventory) },
      { path: 'sales', loadComponent: () => import('./pages/sales').then(m => m.Sales) },
      { path: 'about', loadComponent: () => import('./pages/about').then(m => m.About) },
      { path: 'contact', loadComponent: () => import('./pages/contact').then(m => m.Contact) }
    ]
  },
  { path: '**', redirectTo: '' }
];
