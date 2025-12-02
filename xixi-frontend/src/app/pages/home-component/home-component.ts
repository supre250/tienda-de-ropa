// ------------------------------------------------------
// Home de XI-XI.
// Muestra algunos productos (ej: últimos agregados).
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          // si quieres solo los primeros 8, por ejemplo:
          this.products = resp.data.slice(0, 8);
        } else {
          this.errorMessage = resp.message || 'No se pudieron cargar los productos';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar los productos desde el servidor';
      },
    });
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/300x300?text=XI-XI';
  }
}
