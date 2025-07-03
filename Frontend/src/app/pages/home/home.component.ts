import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PedidoService } from '../../services/pedido.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PedidoService] // Registramos el servicio
})
export class HomeComponent {
  pedidos = [
    { id: 12, nombre: 'Thai Dish', precio: 32900, imagen: 'assets/img/pasta.png' },
    { id: 13, nombre: 'Fragrant', precio: 12000, imagen: 'assets/img/bebida.png' },
    { id: 14, nombre: 'Tasty', precio: 22000, imagen: 'assets/img/arroz.png' }
  ];

  constructor(private pedidoService: PedidoService) {}

  eliminarPedido(id: number): void {
    if (confirm('¿Estás seguro que querés eliminar el pedido?')) {
      this.pedidoService.deletePedido(id).subscribe({
        next: () => {
          this.pedidos = this.pedidos.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar el pedido:', err);
        }
      });
    }
  }
}

