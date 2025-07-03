import { Routes } from '@angular/router';
import { PedidoNuevoComponent } from './pages/pedidoNuevo/pedidoNuevo.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path : 'pedido/:id',
    loadComponent: () =>
      import('./pages/pedidoDetalle/pedidoDetalle.component').then(m => m.PedidoDetalleComponent)
      
  },
  {
    path: 'pedido-nuevo',
    loadComponent: () =>
      import('./pages/pedidoNuevo/pedidoNuevo.component').then(m => m.PedidoNuevoComponent)
  }
];
