// ------------------------------------------------------------------
// Lista de usuarios para el panel ADMIN.
// Permite:
//  - Ver usuarios
//  - Ir a crear / editar
//  - Eliminar usuario
// ------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user-service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin-users-list',
  standalone: true,
  templateUrl: './user-list-component.html',
  styleUrls: ['./user-list-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  deleting: Record<string, boolean> = {};

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          this.users = resp.data;
        } else {
          this.errorMessage =
            resp.message || 'No se pudieron cargar los usuarios';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message || 'Error al cargar los usuarios';
      },
    });
  }

  createUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/users', user._id, 'edit']);
  }

  deleteUser(user: User): void {
    if (!confirm(`¿Eliminar al usuario "${user.name}"?`)) {
      return;
    }

    this.deleting[user._id] = true;

    this.userService.deleteUser(user._id).subscribe({
      next: (resp) => {
        this.deleting[user._id] = false;
        if (resp.success) {
          this.users = this.users.filter((u) => u._id !== user._id);
        } else {
          this.errorMessage =
            resp.message || 'No se pudo eliminar el usuario';
        }
      },
      error: (err) => {
        this.deleting[user._id] = false;
        this.errorMessage =
          err?.error?.message || 'Error al eliminar el usuario';
      },
    });
  }
}
