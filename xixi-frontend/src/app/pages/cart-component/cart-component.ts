// ------------------------------------------------------
// Página de carrito XI-XI.
// - Muestra productos en el carrito
// - Permite cambiar cantidades, eliminar, vaciar
// - Redirige a checkout
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cart, CartItem, CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart-component.html',
  styleUrls: ['./cart-component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  errorMessage = '';
  updating: Record<string, boolean> = {};

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService.loadCart().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          this.cart = resp.data;
        } else {
          this.errorMessage = resp.message || 'No se pudo cargar el carrito';
        }
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 401) {
          // No autenticado → login
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/cart' },
          });
        } else {
          this.errorMessage = err?.error?.message || 'Error al cargar el carrito';
        }
      },
    });
  }

  getItemProductId(item: CartItem): string {
    const prod: any = item.product;
    if (!prod) return '';
    if (typeof prod === 'string') return prod;
    return prod._id || '';
  }

  getItemProductName(item: CartItem): string {
    const prod: any = item.product;
    if (!prod) return 'Producto';
    if (typeof prod === 'string') return 'Producto';
    return prod.name || 'Producto';
  }

  getItemProductImage(item: CartItem): string {
    const prod: any = item.product;
    if (!prod || typeof prod === 'string') {
      return 'https://via.placeholder.com/80x80?text=XI-XI';
    }
    if (prod.images && prod.images.length > 0) {
      return prod.images[0];
    }
    return 'https://via.placeholder.com/80x80?text=XI-XI';
  }

  getItemSubtotal(item: CartItem): number {
    return (item.price || 0) * (item.quantity || 0);
  }

  get cartTotal(): number {
    if (!this.cart) return 0;
    return this.cart.totalAmount || 0;
  }

  changeQuantity(item: CartItem, delta: number): void {
    const prod: any = item.product;
    const productId: string = typeof prod === 'string' ? prod : prod._id;

    const newQty = (item.quantity || 0) + delta;
    if (newQty <= 0) {
      this.removeItem(item);
      return;
    }

    this.updateQuantity(productId, newQty);
  }

  onQuantityBlur(item: CartItem): void {
    const prod: any = item.product;
    const productId: string = typeof prod === 'string' ? prod : prod._id;

    if (item.quantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.updateQuantity(productId, item.quantity);
  }

  private updateQuantity(productId: string, quantity: number): void {
    this.updating[productId] = true;
    this.cartService.updateItem(productId, quantity).subscribe({
      next: (resp) => {
        this.updating[productId] = false;
        if (resp.success) {
          this.cart = resp.data;
        } else {
          this.errorMessage = resp.message || 'No se pudo actualizar el carrito';
        }
      },
      error: (err) => {
        this.updating[productId] = false;
        this.errorMessage = err?.error?.message || 'Error al actualizar el carrito';
      },
    });
  }

  removeItem(item: CartItem): void {
    const prod: any = item.product;
    const productId: string = typeof prod === 'string' ? prod : prod._id;

    this.updating[productId] = true;
    this.cartService.removeItem(productId).subscribe({
      next: (resp) => {
        this.updating[productId] = false;
        if (resp.success) {
          this.cart = resp.data;
        } else {
          this.errorMessage = resp.message || 'No se pudo eliminar el producto';
        }
      },
      error: (err) => {
        this.updating[productId] = false;
        this.errorMessage = err?.error?.message || 'Error al eliminar producto';
      },
    });
  }

  clearCart(): void {
    if (!this.cart || this.cart.items.length === 0) return;

    this.cartService.clearCart().subscribe({
      next: (resp) => {
        if (resp.success) {
          this.cart = resp.data;
        } else {
          this.errorMessage = resp.message || 'No se pudo vaciar el carrito';
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al vaciar el carrito';
      },
    });
  }

  goToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) return;
    this.router.navigate(['/checkout']);
  }
}
