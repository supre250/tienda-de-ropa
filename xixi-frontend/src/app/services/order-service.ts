// ------------------------------------------------------
// Servicio para consumir /api/orders del backend.
// - getAllOrders (ADMIN)
// - getMyOrders (cliente)
// - getOrderById
// - updateOrderStatus (ADMIN)
// - checkout (crear orden desde el carrito)
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:4000/api';

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: any;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
  notes?: string;
}

interface ListResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  // ADMIN: lista todas las órdenes
  getAllOrders(): Observable<ListResponse<Order[]>> {
    return this.http.get<ListResponse<Order[]>>(`${API_BASE_URL}/orders`);
  }

  // Cliente: mis órdenes
  getMyOrders(): Observable<ListResponse<Order[]>> {
    return this.http.get<ListResponse<Order[]>>(`${API_BASE_URL}/orders/my`);
  }

  getOrderById(id: string): Observable<ListResponse<Order>> {
    return this.http.get<ListResponse<Order>>(`${API_BASE_URL}/orders/${id}`);
  }

  updateOrderStatus(
    id: string,
    status: Order['status']
  ): Observable<ListResponse<Order>> {
    return this.http.put<ListResponse<Order>>(
      `${API_BASE_URL}/orders/${id}/status`,
      { status }
    );
  }

  // Cliente: checkout (crear orden a partir del carrito)
  checkout(payload: {
    shippingAddress: string;
    notes?: string;
  }): Observable<ListResponse<Order>> {
    return this.http.post<ListResponse<Order>>(
      `${API_BASE_URL}/orders/checkout`,
      payload
    );
  }
}
