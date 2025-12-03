// ------------------------------------------------------------------
// Formulario para crear / editar usuario (ADMIN).
// - Crear: pide password
// - Editar: NO cambia password (solo datos básicos, rol, activo)
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
import { UserService } from '../../../../services/user-service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  templateUrl: './user-form-component.html',
  styleUrls: ['./user-form-component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  errorMessage = '';
  isEditMode = false;
  userId: string | null = null;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
      // en edición no exigimos password
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CUSTOMER', Validators.required],
      isActive: [true],
    });
  }

  loadUser(id: string): void {
    this.loading = true;

    this.userService.getUserById(id).subscribe({
      next: (resp) => {
        this.loading = false;
        if (!resp.success) {
          this.errorMessage = resp.message || 'Usuario no encontrado';
          return;
        }

        const u: User = resp.data;
        this.form.patchValue({
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: u.isActive ?? true,
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar el usuario';
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

    this.saving = true;

    if (this.isEditMode && this.userId) {
      // Editar: sin password
      const payload = {
        name: raw.name,
        email: raw.email,
        role: raw.role,
        isActive: !!raw.isActive,
      };

      this.userService.updateUser(this.userId, payload).subscribe({
        next: (resp) => {
          this.saving = false;
          if (!resp.success) {
            this.errorMessage =
              resp.message || 'No se pudo actualizar el usuario';
            return;
          }

          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage =
            err?.error?.message || 'Error al actualizar el usuario';
        },
      });
    } else {
      // Crear: sí enviamos password
      const payload = {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        isActive: !!raw.isActive,
      };

      this.userService.createUser(payload).subscribe({
        next: (resp) => {
          this.saving = false;
          if (!resp.success) {
            this.errorMessage =
              resp.message || 'No se pudo crear el usuario';
            return;
          }

          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.saving = false;
          this.errorMessage =
            err?.error?.message || 'Error al crear el usuario';
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }

  get nameControl() {
    return this.form.get('name')!;
  }

  get emailControl() {
    return this.form.get('email')!;
  }

  get passwordControl() {
    return this.form.get('password')!;
  }
}
