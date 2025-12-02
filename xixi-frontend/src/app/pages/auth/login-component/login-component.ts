// ------------------------------------------------------
// Pantalla de Login de XI-XI.
// - Usa ReactiveFormsModule (formulario reactivo)
// - Llama a AuthService.login()
// - Guarda sesión y redirige según el rol
// ------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, lo redirigimos
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
      return;
    }

    // Leer returnUrl de los query params (si viene del AuthGuard)
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
    });

    // Construir formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Getters prácticos para el template
  get emailControl() {
    return this.loginForm.get('email')!;
  }

  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loading = true;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;

        if (!response.success) {
          this.errorMessage = response.message || 'Error al iniciar sesión';
          return;
        }

        // Si es admin → al panel; si no, al returnUrl (o home)
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.loading = false;
        // Puedes mejorar este manejo según tu backend
        this.errorMessage =
          err?.error?.message || 'Credenciales inválidas o error de servidor';
      },
    });
  }
}
