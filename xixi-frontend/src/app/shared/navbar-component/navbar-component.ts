// ------------------------------------------------------
// Navbar principal de XI-XI.
// - Muestra links de navegación
// - Muestra login/register o nombre + logout
// - Muestra contador del carrito
// ------------------------------------------------------
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart-service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartCount = 0;
  isMenuOpen = false;

  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribir al usuario actual
    const subUser = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.subs.push(subUser);

    // Suscribir al contador del carrito
    const subCart = this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
    this.subs.push(subCart);

    // Cargar carrito inicial (si hay sesión)
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
