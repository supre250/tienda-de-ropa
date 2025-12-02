// ------------------------------------------------------
// Servicio de autenticación para XI-XI.
// Compatible con SSR (revisa que solo use localStorage en browser).
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

const API_BASE_URL = 'http://localhost:4000/api';
const TOKEN_KEY = 'xixi_token';
const USER_KEY = 'xixi_user';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable para cambios de usuario
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadUserFromStorage()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ------------------------------
  // Helpers de entorno (SSR-safe)
  // ------------------------------

  private isBrowser(): boolean {
    // Solo hay window/localStorage en el navegador
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // ------------------------------
  // Métodos públicos de autenticación
  // ------------------------------

  login(email: string, password: string): Observable<AuthResponse> {
    const url = `${API_BASE_URL}/auth/login`;
    return this.http.post<AuthResponse>(url, { email, password }).pipe(
      tap((response) => {
        if (response.success && response.data?.token) {
          this.saveSession(response.data.user, response.data.token);
        }
      })
    );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const url = `${API_BASE_URL}/auth/register`;
    return this.http.post<AuthResponse>(url, { name, email, password }).pipe(
      tap((response) => {
        if (response.success && response.data?.token) {
          this.saveSession(response.data.user, response.data.token);
        }
      })
    );
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    const url = `${API_BASE_URL}/auth/me`;
    return this.http.get<{ success: boolean; data: User }>(url).pipe(
      tap((response) => {
        if (response.success && response.data) {
          const token = this.getToken();
          if (token) {
            this.saveSession(response.data, token);
          }
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  // ------------------------------
  // Helpers de estado
  // ------------------------------

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'ADMIN';
  }

  // ------------------------------
  // Funciones privadas
  // ------------------------------

  private saveSession(user: User, token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): User | null {
    if (!this.isBrowser()) {
      return null;
    }

    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
