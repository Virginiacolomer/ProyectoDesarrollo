import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  pedidos = [
    { id: 12, nombre: 'Thai Dish', precio: 32900, imagen: 'assets/img/pasta.png' },
    { id: 13, nombre: 'Fragrant', precio: 12000, imagen: 'assets/img/bebida.png' },
    { id: 14, nombre: 'Tasty', precio: 22000, imagen: 'assets/img/arroz.png' }
  ];
}
