// ------------------------------------------------------
// Listado general de productos.
// Incluye un buscador simple por nombre.
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService
      .getProducts({
        search: this.searchTerm || undefined,
      })
      .subscribe({
        next: (resp) => {
          this.loading = false;
          if (resp.success) {
            this.products = resp.data;
          } else {
            this.errorMessage = resp.message || 'No se pudieron cargar los productos';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Error al cargar los productos';
        },
      });
  }

  onSearch(): void {
    this.loadProducts();
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/300x300?text=XI-XI';
  }

  getCategoryName(product: Product): string {
    const category: any = product.category;

    // Si no hay categoría, devolver vacío
    if (!category) {
      return '';
    }

    // Si el backend solo devuelve el id (string), no hay nombre
    if (typeof category === 'string') {
      return '';
    }

    // Si está populado, debería tener name
    return category.name || '';
  }
}
