import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { PasarelaComponent } from './components/pasarela/pasarela.component';

export const routes: Routes = [
  {
    path: '', // Ruta raíz
    component: PasarelaComponent,
  },
  {
    path: 'pasarela', // Ruta para el componente de Pasarela
    component: IndexComponent,
  },
  {
    path: '**', // Ruta comodín para manejar rutas no encontradas (404)
    redirectTo: '', // Redirige a la ruta raíz (IndexComponent)
    pathMatch: 'full',
  },
];
