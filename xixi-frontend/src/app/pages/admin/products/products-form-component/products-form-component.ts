// ------------------------------------------------------------------
// Formulario para crear / editar un producto (ADMIN).
// Usa:
//  - ProductService
//  - CategoryService para <select> de categorías.
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

import { ProductService } from '../../../../services/product-service';
import { CategoryService } from '../../../../services/category-service';
import { Category } from '../../../../models/category.model';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  templateUrl: './products-form-component.html',
  styleUrls: ['./products-form-component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ProductsFormComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();

    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: [''],
      sizes: [''],
      isActive: [true],
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (resp) => {
        if (resp.success) {
          this.categories = resp.data;
        }
      },
      error: () => {},
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (resp) => {
        this.loading = false;
        if (!resp.success) {
          this.errorMessage = resp.message || 'Producto no encontrado';
          return;
        }

        const p: Product = resp.data;
        this.form.patchValue({
          name: p.name,
          description: p.description,
          price: p.price,
          category: typeof p.category === 'string' ? p.category : (p.category as any)._id,
          stock: p.stock,
          images: (p.images || []).join(', '),
          sizes: (p.sizes || []).join(', '),
          isActive: p.isActive ?? true,
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar el producto';
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

    const payload: Partial<Product> = {
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      category: raw.category,
      stock: Number(raw.stock),
      images: (raw.images as string)
        ? (raw.images as string)
            .split(',')
            .map((s) => s.trim())
            .filter((s) => !!s)
        : [],
      sizes: (raw.sizes as string)
        ? (raw.sizes as string)
            .split(',')
            .map((s) => s.trim())
            .filter((s) => !!s)
        : [],
      isActive: !!raw.isActive,
    };

    this.saving = true;

    const obs = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, payload)
      : this.productService.createProduct(payload);

    obs.subscribe({
      next: (resp) => {
        this.saving = false;
        if (!resp.success) {
          this.errorMessage =
            resp.message || 'No se pudo guardar el producto';
          return;
        }

        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage =
          err?.error?.message || 'Error al guardar el producto';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }

  get nameControl() {
    return this.form.get('name')!;
  }

  get priceControl() {
    return this.form.get('price')!;
  }

  get categoryControl() {
    return this.form.get('category')!;
  }

  get stockControl() {
    return this.form.get('stock')!;
  }
}
