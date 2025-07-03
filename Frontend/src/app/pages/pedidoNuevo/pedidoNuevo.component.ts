import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedido-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidoNuevo.component.html',
  styleUrls: ['./pedidoNuevo.component.css']
})
export class PedidoNuevoComponent {
  productos = [
    {
      nombre: 'PIZZA NAPOLITANA',
      descripcion: 'Con tomate',
      precio: 12000,
      imagen: 'assets/img/pizza.png'
    },
    {
      nombre: 'PASTA AL TONNO',
      descripcion: 'Vegetariana',
      precio: 32900,
      imagen: 'assets/img/pasta.png'
    }
  ];
}
