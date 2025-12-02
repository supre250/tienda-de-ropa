// ------------------------------------------------------
// Modelo (interface) para el usuario que viene del backend.
// Coincide con lo que devuelve el login y /auth/me.
// ------------------------------------------------------
export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
