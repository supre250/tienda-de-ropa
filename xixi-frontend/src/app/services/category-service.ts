// ------------------------------------------------------
// Servicio para consumir /api/categories del backend.
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

  getCategories(): Observable<ListResponse<Category[]>> {
    return this.http.get<ListResponse<Category[]>>(`${API_BASE_URL}/categories`);
  }

  getCategoryById(id: string): Observable<ListResponse<Category>> {
    return this.http.get<ListResponse<Category>>(
      `${API_BASE_URL}/categories/${id}`
    );
  }
}
