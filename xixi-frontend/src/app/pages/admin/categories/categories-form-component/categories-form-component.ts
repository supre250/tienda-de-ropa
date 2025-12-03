// ------------------------------------------------------------------
// Formulario para crear / editar una categoría (ADMIN).
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../services/category-service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  templateUrl: './categories-form-component.html',
  styleUrls: ['./categories-form-component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  errorMessage = '';
  isEditMode = false;
  categoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode && this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  loadCategory(id: string): void {
    this.loading = true;

    this.categoryService.getCategoryById(id).subscribe({
      next: (resp) => {
        this.loading = false;
        if (!resp.success) {
          this.errorMessage = resp.message || 'Categoría no encontrada';
          return;
        }

        const cat: Category = resp.data;
        this.form.patchValue({
          name: cat.name,
          description: cat.description,
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar la categoría';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const payload: Partial<Category> = {
      name: raw.name,
      description: raw.description,
    };

    this.saving = true;

    const obs =
      this.isEditMode && this.categoryId
        ? this.categoryService.updateCategory(this.categoryId, payload)
        : this.categoryService.createCategory(payload);

    obs.subscribe({
      next: (resp) => {
        this.saving = false;
        if (!resp.success) {
          this.errorMessage =
            resp.message || 'No se pudo guardar la categoría';
          return;
        }

        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage =
          err?.error?.message || 'Error al guardar la categoría';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/categories']);
  }

  get nameControl() {
    return this.form.get('name')!;
  }
}
