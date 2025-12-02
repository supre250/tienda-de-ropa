import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail-component.html',
  styleUrls: ['./product-detail-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  errorMessage = '';
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.errorMessage = 'ID de producto inválido';
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          this.product = resp.data;
        } else {
          this.errorMessage = resp.message || 'Producto no encontrado';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar el producto';
      },
    });
  }

  getProductImage(product: Product): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'https://via.placeholder.com/500x500?text=XI-XI';
  }

  addToCart(): void {
    if (!this.product) return;
    this.addingToCart = true;

    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: (resp) => {
        this.addingToCart = false;
        if (!resp.success) {
          this.errorMessage =
            resp.message || 'No se pudo agregar al carrito';
        }
      },
      error: (err) => {
        this.addingToCart = false;

        if (err?.status === 401) {
          // No autenticado → login
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url },
          });
        } else {
          this.errorMessage =
            err?.error?.message || 'Error al agregar al carrito';
        }
      },
    });
  }
}
