// ------------------------------------------------------------------
// Panel de administración XI-XI
// Muestra estadísticas básicas y órdenes recientes.
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../../services/product-service';
import { CategoryService } from '../../../services/category-service';
import { OrderService } from '../../../services/order-service';
import { UserService } from '../../../services/user-service';

interface ListResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';

  totalProducts = 0;
  totalCategories = 0;
  totalOrders = 0;
  totalSales = 0;
  totalUsers = 0;

  recentOrders: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.errorMessage = '';

    // Productos
    this.productService.getProducts().subscribe({
      next: (resp: ListResponse<any[]>) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.totalProducts = resp.data.length;
        }
      },
      error: () => {
        // no rompemos el dashboard por esto
      },
    });

    // Categorías
    this.categoryService.getCategories().subscribe({
      next: (resp: ListResponse<any[]>) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.totalCategories = resp.data.length;
        }
      },
      error: () => {},
    });

    // Órdenes
    this.orderService.getAllOrders().subscribe({
      next: (resp: ListResponse<any[]>) => {
        this.loading = false;

        if (!resp.success || !Array.isArray(resp.data)) {
          this.errorMessage =
            resp.message || 'No se pudieron cargar las órdenes';
          return;
        }

        const orders = resp.data;
        this.totalOrders = orders.length;
        this.totalSales = orders.reduce(
          (sum: number, o: any) => sum + (o.totalAmount || 0),
          0
        );
        this.recentOrders = orders.slice(0, 5);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar las estadísticas';
      },
    });

    // Usuarios
    this.userService.getUsers().subscribe({
      next: (resp: ListResponse<any[]>) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.totalUsers = resp.data.length;
        }
      },
      error: () => {
        // si falla, dejamos totalUsers en 0
      },
    });
  }

  // Texto bonito para el estado de la orden
  getStatusLabel(status: string): string {
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
}
