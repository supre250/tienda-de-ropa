// ------------------------------------------------------------------
// Lista de categorías para el panel ADMIN.
// Permite:
//  - Ver categorías
//  - Ir a crear / editar
//  - Eliminar categoría
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../services/category-service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-admin-categories-list',
  standalone: true,
  templateUrl: './categories-list-component.html',
  styleUrls: ['./categories-list-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  deleting: Record<string, boolean> = {};

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          this.categories = resp.data;
        } else {
          this.errorMessage =
            resp.message || 'No se pudieron cargar las categorías';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar las categorías';
      },
    });
  }

  createCategory(): void {
    this.router.navigate(['/admin/categories/new']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/admin/categories', category._id, 'edit']);
  }

  deleteCategory(category: Category): void {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      return;
    }

    this.deleting[category._id] = true;

    this.categoryService.deleteCategory(category._id).subscribe({
      next: (resp) => {
        this.deleting[category._id] = false;
        if (resp.success) {
          this.categories = this.categories.filter(
            (c) => c._id !== category._id
          );
        } else {
          this.errorMessage =
            resp.message || 'No se pudo eliminar la categoría';
        }
      },
      error: (err) => {
        this.deleting[category._id] = false;
        this.errorMessage =
          err?.error?.message || 'Error al eliminar la categoría';
      },
    });
  }
}
