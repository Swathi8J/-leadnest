import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'leads/new',
        loadComponent: () =>
          import('./pages/lead-form/lead-form.component').then((m) => m.LeadFormComponent),
      },
      {
        path: 'leads/:id/edit',
        loadComponent: () =>
          import('./pages/lead-form/lead-form.component').then((m) => m.LeadFormComponent),
      },
      {
        path: 'leads/:id',
        loadComponent: () =>
          import('./pages/lead-detail/lead-detail.component').then((m) => m.LeadDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
