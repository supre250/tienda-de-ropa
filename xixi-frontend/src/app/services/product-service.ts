// ------------------------------------------------------
// Servicio para consumir /api/products del backend.
// - getProducts (público y admin)
// - getProductById
// - createProduct (ADMIN)
// - updateProduct (ADMIN)
// - deleteProduct (ADMIN)
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const API_BASE_URL = 'http://localhost:4000/api';

interface ListResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Listar productos con filtros opcionales
  getProducts(options?: {
    search?: string;
    categoryId?: string;
  }): Observable<ListResponse<Product[]>> {
    let params = new HttpParams();

    if (options?.search) {
      params = params.set('search', options.search);
    }

    if (options?.categoryId) {
      params = params.set('category', options.categoryId);
    }

    return this.http.get<ListResponse<Product[]>>(
      `${API_BASE_URL}/products`,
      { params }
    );
  }

  // Obtener un producto por ID
  getProductById(id: string): Observable<ListResponse<Product>> {
    return this.http.get<ListResponse<Product>>(
      `${API_BASE_URL}/products/${id}`
    );
  }

  // Crear producto (ADMIN)
  createProduct(payload: Partial<Product>): Observable<ListResponse<Product>> {
    return this.http.post<ListResponse<Product>>(
      `${API_BASE_URL}/products`,
      payload
    );
  }

  // Actualizar producto (ADMIN)
  updateProduct(
    id: string,
    payload: Partial<Product>
  ): Observable<ListResponse<Product>> {
    return this.http.put<ListResponse<Product>>(
      `${API_BASE_URL}/products/${id}`,
      payload
    );
  }

  // Eliminar producto (ADMIN)
  deleteProduct(id: string): Observable<ListResponse<null>> {
    return this.http.delete<ListResponse<null>>(
      `${API_BASE_URL}/products/${id}`
    );
  }
}
