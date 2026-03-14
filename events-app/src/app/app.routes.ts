import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./events/events-list/events-list').then((c) => c.EventsList),
  },
];
