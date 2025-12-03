// ------------------------------------------------------------------
// Lista de órdenes para el panel ADMIN.
// Permite:
//  - Ver todas las órdenes
//  - Ver datos básicos del cliente
//  - Cambiar el estado de la orden
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../../services/order-service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders-list',
  standalone: true,
  templateUrl: './orders-list-component.html',
  styleUrls: ['./orders-list-component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  errorMessage = '';
  updating: Record<string, boolean> = {};
  filterStatus: '' | Order['status'] = '';

  readonly statuses: Order['status'][] = [
    'PENDING',
    'PAID',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getAllOrders().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          this.orders = resp.data;
        } else {
          this.errorMessage =
            resp.message || 'No se pudieron cargar las órdenes';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar las órdenes';
      },
    });
  }

  get filteredOrders(): Order[] {
    if (!this.filterStatus) return this.orders;
    return this.orders.filter((o) => o.status === this.filterStatus);
  }

  getUserName(order: Order): string {
    const u: any = order.user;
    if (!u) return 'Sin usuario';
    return u.name || u.email || 'Sin usuario';
  }

  getStatusLabel(status: Order['status']): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'PAID':
        return 'Pagada';
      case 'SHIPPED':
        return 'Enviada';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  }

  onStatusChange(order: Order, newStatus: string): void {
    if (!newStatus || newStatus === order.status) return;

    const status = newStatus as Order['status'];

    if (!confirm(`¿Cambiar estado de la orden a "${this.getStatusLabel(status)}"?`)) {
      return;
    }

    this.updating[order._id] = true;

    this.orderService.updateOrderStatus(order._id, status).subscribe({
      next: (resp) => {
        this.updating[order._id] = false;
        if (!resp.success) {
          this.errorMessage =
            resp.message || 'No se pudo actualizar el estado';
          return;
        }

        const updated = resp.data;
        this.orders = this.orders.map((o) =>
          o._id === updated._id ? updated : o
        );
      },
      error: (err) => {
        this.updating[order._id] = false;
        this.errorMessage =
          err?.error?.message || 'Error al actualizar el estado';
      },
    });
  }
}
