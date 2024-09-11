import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Cambia Route por Router

@Component({
  selector: 'app-pasarela',
  standalone: true,
  imports: [],
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css'],
})
export class PasarelaComponent {
  constructor(private router: Router) {} // Cambia el tipo de Route a Router

  pagarAhora() {
    // Aquí puedes agregar cualquier lógica previa a la navegación
    this.router.navigate(['/pasarela']); // Usamos navigate para redirigir
  }
}
