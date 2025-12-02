import { Routes } from '@angular/router';

// Páginas públicas
import { HomeComponent } from './pages/home-component/home-component';
import { ProductListComponent } from './pages/product-list-component/product-list-component';
import { ProductDetailComponent } from './pages/product-detail-component/product-detail-component';
import { CategoryProductsComponent } from './pages/category-products-component/category-products-component';
import { CartComponent } from './pages/cart-component/cart-component';
import { CheckoutComponent } from './pages/checkout-component/checkout-component';

// Auth
import { LoginComponent } from './pages/auth/login-component/login-component';
import { RegisterComponent } from './pages/auth/register-component/register-component';

// Admin
import { DashboardComponent } from './pages/admin/dashboard-component/dashboard-component';
import { ProductsListComponent } from './pages/admin/products/products-list-component/products-list-component';
import { ProductsFormComponent } from './pages/admin/products/products-form-component/products-form-component';
import { CategoriesListComponent } from './pages/admin/categories/categories-list-component/categories-list-component';
import { CategoriesFormComponent } from './pages/admin/categories/categories-form-component/categories-form-component';
import { UserListComponent } from './pages/admin/users/user-list-component/user-list-component';
import { UserFormComponent } from './pages/admin/users/user-form-component/user-form-component';

// Guards
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // PÚBLICO
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },

  { path: 'category/:id', component: CategoryProductsComponent },

  { path: 'cart', component: CartComponent },

  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard], // solo usuarios logueados
  },

  // ADMIN (protegido)
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },

      // Productos
      { path: 'products', component: ProductsListComponent },
      { path: 'products/new', component: ProductsFormComponent },
      { path: 'products/:id/edit', component: ProductsFormComponent }, // editar

      // Categorías
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/new', component: CategoriesFormComponent },
      { path: 'categories/:id', component: CategoriesFormComponent }, // editar

      // Usuarios
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id', component: UserFormComponent }, // editar
    ],
  },

  // CUALQUIER OTRA RUTA → HOME (o puedes hacer página 404)
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
