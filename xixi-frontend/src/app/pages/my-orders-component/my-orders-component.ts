// ------------------------------------------------------------------
// Página de "Mis pedidos" para el usuario autenticado.
// Muestra las órdenes del usuario y sus detalles básicos.
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, Order } from '../../services/order-service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  templateUrl: './my-orders-component.html',
  styleUrls: ['./my-orders-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          this.orders = resp.data;
        } else {
          this.errorMessage =
            resp.message || 'No se pudieron cargar tus pedidos';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar tus pedidos';
      },
    });
  }

  getStatusLabel(status: Order['status']): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PAID':
        return 'Pagada';
      case 'SHIPPED':
        return 'En camino';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  }

  getStatusClass(status: Order['status']): string {
    return status.toLowerCase();
  }
}
