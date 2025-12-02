// ------------------------------------------------------------------
// Lista de productos para el panel ADMIN.
// Permite:
//  - Ver productos
//  - Ir a crear / editar
//  - Eliminar producto
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product-service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  templateUrl: './products-list-component.html',
  styleUrls: ['./products-list-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  deleting: Record<string, boolean> = {};

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

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
          this.products = resp.data;
        } else {
          this.errorMessage =
            resp.message || 'No se pudieron cargar los productos';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar los productos';
      },
    });
  }

  createProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/admin/products', product._id, 'edit']);
  }

  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar el producto "${product.name}"?`)) {
      return;
    }

    this.deleting[product._id] = true;

    this.productService.deleteProduct(product._id).subscribe({
      next: (resp) => {
        this.deleting[product._id] = false;
        if (resp.success) {
          // quitar del array
          this.products = this.products.filter((p) => p._id !== product._id);
        } else {
          this.errorMessage =
            resp.message || 'No se pudo eliminar el producto';
        }
      },
      error: (err) => {
        this.deleting[product._id] = false;
        this.errorMessage =
          err?.error?.message || 'Error al eliminar el producto';
      },
    });
  }

  getCategoryName(product: Product): string {
    const cat: any = product.category;
    if (!cat) return '';
    if (typeof cat === 'string') return ''; // solo id
    return cat.name || '';
  }
}
