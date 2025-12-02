// ------------------------------------------------------
// Modelo de categoría, igual a lo que devuelve el backend
// desde /api/categories
// ------------------------------------------------------
export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
