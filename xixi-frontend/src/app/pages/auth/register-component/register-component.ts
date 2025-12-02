// ------------------------------------------------------
// Pantalla de Registro de XI-XI.
// - Usa ReactiveFormsModule
// - Valida nombre, email, password y confirmación
// - Llama a AuthService.register()
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, lo sacamos de aquí
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
      return;
    }

    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [this.passwordsMatchValidator],
      }
    );
  }

  // ------------------- Getters para el template -------------------

  get nameControl(): AbstractControl {
    return this.registerForm.get('name')!;
  }

  get emailControl(): AbstractControl {
    return this.registerForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.registerForm.get('password')!;
  }

  get confirmPasswordControl(): AbstractControl {
    return this.registerForm.get('confirmPassword')!;
  }

  // ------------------- Validator de passwords -------------------

  // Valida que password y confirmPassword sean iguales
  private passwordsMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (password && confirm && password !== confirm) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // Para saber si hay error de "password no coincide"
  get passwordMismatch(): boolean {
    return (
      this.registerForm.errors?.['passwordMismatch'] &&
      this.confirmPasswordControl.touched
    );
  }

  // ------------------- Submit -------------------

  onSubmit(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.loading = true;

    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        this.loading = false;

        if (!response.success) {
          this.errorMessage = response.message || 'Error al registrarse';
          return;
        }

        // Por defecto el backend crea CUSTOMER; si fuera admin te manda al panel
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'No se pudo completar el registro';
      },
    });
  }
}
