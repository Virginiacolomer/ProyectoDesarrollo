import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl:'./pedidoDetalle.component.html',
  styleUrls: ['./pedidoDetalle.component.css'] // Ensure this file exists in the same folder as this component, or create it if missing
})

export class PedidoDetalleComponent {
  pedido: any;

  // Datos quemados para prueba. Reemplazar luego por un servicio.
  pedidos = [
    { id: 12, nombre: 'Thai Dish', precio: 32900, imagen: 'assets/img/pasta.png', producto: 'Pasta Al Tonno', direccion: 'Calle Siempre viva 742', estado: 'Pendiente de entrega' },
    { id: 13, nombre: 'Fragrant', precio: 12000, imagen: 'assets/img/bebida.png', producto: 'Jugo de frutos rojos', direccion: 'Calle Falsa 123', estado: 'Entregado' },
    { id: 14, nombre: 'Tasty', precio: 22000, imagen: 'assets/img/arroz.png', producto: 'Arroz con pollo', direccion: 'Av. del Sol 999', estado: 'En camino' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pedido = this.pedidos.find(p => p.id === id);
  }

}



