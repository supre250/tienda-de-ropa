// ------------------------------------------------------
// Lista de productos filtrados por categoría.
// Usa la ruta /category/:id
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-products',
  standalone: true,
  templateUrl: './category-products-component.html',
  styleUrls: ['./category-products-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class CategoryProductsComponent implements OnInit {
  products: Product[] = [];
  category: Category | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.loadCategory(categoryId);
      this.loadProducts(categoryId);
    } else {
      this.errorMessage = 'ID de categoría inválido';
    }
  }

  loadCategory(id: string): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.category = resp.data;
        }
      },
      error: () => {
        // no bloqueamos la vista si solo falla el nombre de la categoría
      },
    });
  }

  loadProducts(categoryId: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService
      .getProducts({ categoryId })
      .subscribe({
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
            err?.error?.message || 'Error al cargar productos';
        },
      });
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/300x300?text=XI-XI';
  }
}
