// ------------------------------------------------------
// Tablero de administración XI-XI.
// Muestra métricas básicas utilizando:
// - ProductService
// - CategoryService
// - OrderService
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../../services/product-service';
import { CategoryService } from '../../../services/category-service';
import { OrderService, Order } from '../../../services/order-service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

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

  recentOrders: Order[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.errorMessage = '';

    // Cargamos productos
    this.productService.getProducts().subscribe({
      next: (resp) => {
        if (resp.success) {
          const products: Product[] = resp.data;
          this.totalProducts = products.length;
        }
      },
      error: () => {
        this.errorMessage = 'Error al cargar productos';
      },
    });

    // Cargamos categorías
    this.categoryService.getCategories().subscribe({
      next: (resp) => {
        if (resp.success) {
          const categories: Category[] = resp.data;
          this.totalCategories = categories.length;
        }
      },
      error: () => {
        this.errorMessage = this.errorMessage || 'Error al cargar categorías';
      },
    });

    // Cargamos órdenes (ADMIN)
    this.orderService.getAllOrders().subscribe({
      next: (resp) => {
        this.loading = false;

        if (!resp.success) {
          this.errorMessage = resp.message || 'Error al cargar órdenes';
          return;
        }

        const orders: Order[] = resp.data;
        this.totalOrders = orders.length;

        // Total de ventas (omitimos CANCELLED)
        this.totalSales = orders
          .filter((o) => o.status !== 'CANCELLED')
          .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

        // Órdenes más recientes (primeras 5)
        this.recentOrders = orders.slice(0, 5);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar órdenes del servidor';
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
