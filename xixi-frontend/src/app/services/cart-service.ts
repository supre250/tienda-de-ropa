// ------------------------------------------------------
// Servicio de carrito XI-XI.
// Maneja:
// - get cart
// - add item
// - update item
// - remove item
// - clear
// Y expone un observable cartCount$ para mostrar el total de items.
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

const API_BASE_URL = 'http://localhost:4000/api';

export interface CartItem {
  product: Product | string;
  quantity: number;
  price: number; // precio unitario
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener carrito actual
  loadCart(): Observable<CartResponse> {
    return this.http
      .get<CartResponse>(`${API_BASE_URL}/cart`)
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  // Agregar item al carrito
  addToCart(productId: string, quantity = 1): Observable<CartResponse> {
    return this.http
      .post<CartResponse>(`${API_BASE_URL}/cart/add`, { productId, quantity })
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  // Actualizar cantidad
  updateItem(productId: string, quantity: number): Observable<CartResponse> {
    return this.http
      .put<CartResponse>(`${API_BASE_URL}/cart/update`, { productId, quantity })
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  // Eliminar item
  removeItem(productId: string): Observable<CartResponse> {
    return this.http
      .delete<CartResponse>(`${API_BASE_URL}/cart/item/${productId}`)
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  // Vaciar carrito
  clearCart(): Observable<CartResponse> {
    return this.http
      .delete<CartResponse>(`${API_BASE_URL}/cart/clear`)
      .pipe(tap((resp) => this.updateCountFromCart(resp)));
  }

  // ------------------ helpers privados ------------------

  private updateCountFromCart(resp: CartResponse): void {
    if (!resp.success || !resp.data) {
      this.cartCountSubject.next(0);
      return;
    }

    const totalItems = (resp.data.items || []).reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    this.cartCountSubject.next(totalItems);
  }
}
