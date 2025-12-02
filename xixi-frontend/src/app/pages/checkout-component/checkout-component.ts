// ------------------------------------------------------
// Página de Checkout XI-XI.
// - Muestra resumen del carrito
// - Pide dirección y notas
// - Crea orden en backend (OrderService.checkout)
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  Cart,
  CartService,
  CartItem,
} from '../../services/cart-service';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout-component.html',
  styleUrls: ['./checkout-component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loadingCart = false;
  errorMessage = '';

  shippingAddress = '';
  notes = '';

  submitting = false;
  successMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loadingCart = true;
    this.errorMessage = '';

    this.cartService.loadCart().subscribe({
      next: (resp) => {
        this.loadingCart = false;
        if (resp.success) {
          this.cart = resp.data;
          if (!this.cart || this.cart.items.length === 0) {
            this.errorMessage = 'Tu carrito está vacío.';
          }
        } else {
          this.errorMessage = resp.message || 'No se pudo cargar el carrito';
        }
      },
      error: (err) => {
        this.loadingCart = false;
        if (err?.status === 401) {
          // No autenticado → login
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/checkout' },
          });
        } else {
          this.errorMessage =
            err?.error?.message || 'Error al cargar el carrito';
        }
      },
    });
  }

  get cartTotal(): number {
    if (!this.cart) return 0;
    return this.cart.totalAmount || 0;
  }

  getItemName(item: CartItem): string {
    const prod: any = item.product;
    if (!prod) return 'Producto';
    if (typeof prod === 'string') return 'Producto';
    return prod.name || 'Producto';
  }

  // --------------------- Checkout ---------------------

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.cart || this.cart.items.length === 0) {
      this.errorMessage = 'Tu carrito está vacío.';
      return;
    }

    if (!this.shippingAddress.trim()) {
      this.errorMessage = 'La dirección de envío es obligatoria.';
      return;
    }

    this.submitting = true;

    this.orderService
      .checkout({
        shippingAddress: this.shippingAddress.trim(),
        notes: this.notes.trim() || undefined,
      })
      .subscribe({
        next: (resp) => {
          this.submitting = false;

          if (!resp.success) {
            this.errorMessage =
              resp.message || 'No se pudo completar el checkout.';
            return;
          }

          // Limpiar carrito local
          this.cart = { items: [], totalAmount: 0 };
          this.successMessage = '¡Pedido realizado con éxito!';

          // Opcional: redirigir después de unos segundos
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message || 'Error al procesar el pedido.';
        },
      });
  }
}
