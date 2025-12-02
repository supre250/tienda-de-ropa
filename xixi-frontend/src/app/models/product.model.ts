// ------------------------------------------------------
// Modelo de producto para XI-XI.
// Coincide con el esquema de Product en el backend.
// ------------------------------------------------------
import { Category } from './category.model';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  // El backend devuelve category como ObjectId, pero si usamos populate
  // puede venir como Category. Soportamos ambas formas.
  category: string | Category;
  sizes: string[];
  stock: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
