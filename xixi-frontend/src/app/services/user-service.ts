// ------------------------------------------------------
// Servicio ADMIN para gestionar usuarios (CRUD).
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const API_BASE_URL = 'http://localhost:4000/api';

interface ListResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Listar todos los usuarios (ADMIN)
  getUsers(): Observable<ListResponse<User[]>> {
    return this.http.get<ListResponse<User[]>>(`${API_BASE_URL}/users`);
  }

  // Obtener un usuario por id (ADMIN)
  getUserById(id: string): Observable<ListResponse<User>> {
    return this.http.get<ListResponse<User>>(`${API_BASE_URL}/users/${id}`);
  }

  // Crear usuario (ADMIN)
  createUser(payload: {
    name: string;
    email: string;
    password: string;
    role: 'CUSTOMER' | 'ADMIN';
    isActive: boolean;
  }): Observable<ListResponse<User>> {
    return this.http.post<ListResponse<User>>(
      `${API_BASE_URL}/users`,
      payload
    );
  }

  // Actualizar usuario (ADMIN) – sin password
  updateUser(
    id: string,
    payload: {
      name?: string;
      email?: string;
      role?: 'CUSTOMER' | 'ADMIN';
      isActive?: boolean;
    }
  ): Observable<ListResponse<User>> {
    return this.http.put<ListResponse<User>>(
      `${API_BASE_URL}/users/${id}`,
      payload
    );
  }

  // Eliminar usuario (ADMIN)
  deleteUser(id: string): Observable<ListResponse<null>> {
    return this.http.delete<ListResponse<null>>(
      `${API_BASE_URL}/users/${id}`
    );
  }
}
