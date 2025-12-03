// ------------------------------------------------------
// Servicio para /api/categories (CRUD).
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

const API_BASE_URL = 'http://localhost:4000/api';

interface ListResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  // Listar todas las categorías
  getCategories(): Observable<ListResponse<Category[]>> {
    return this.http.get<ListResponse<Category[]>>(
      `${API_BASE_URL}/categories`
    );
  }

  // Obtener una categoría por id
  getCategoryById(id: string): Observable<ListResponse<Category>> {
    return this.http.get<ListResponse<Category>>(
      `${API_BASE_URL}/categories/${id}`
    );
  }

  // Crear categoría (ADMIN)
  createCategory(payload: Partial<Category>): Observable<ListResponse<Category>> {
    return this.http.post<ListResponse<Category>>(
      `${API_BASE_URL}/categories`,
      payload
    );
  }

  // Actualizar categoría (ADMIN)
  updateCategory(
    id: string,
    payload: Partial<Category>
  ): Observable<ListResponse<Category>> {
    return this.http.put<ListResponse<Category>>(
      `${API_BASE_URL}/categories/${id}`,
      payload
    );
  }

  // Eliminar categoría (ADMIN)
  deleteCategory(id: string): Observable<ListResponse<null>> {
    return this.http.delete<ListResponse<null>>(
      `${API_BASE_URL}/categories/${id}`
    );
  }
}
