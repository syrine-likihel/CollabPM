import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

type RoleFilter =
  | 'ALL'
  | 'ADMIN'
  | 'PROJECT_MANAGER'
  | 'MEMBER';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  loading = false;
  submitting = false;

  searchText = '';

  roleFilter: RoleFilter = 'ALL';

  showCreateForm = false;

  createForm = this.emptyCreateForm();

  constructor(
    private readonly userService: UserService,
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {

    // Only ADMIN can access Users page
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadUsers();
  }



  loadUsers(): void {

    this.loading = true;

    this.userService.getAll().subscribe({

      next: (users) => {

        this.users = users ?? [];

        this.loading = false;
      },

      error: (err) => {

        console.error('Error loading users:', err);

        this.users = [];

        this.loading = false;
      }
    });
  }


  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {

    this.showCreateForm = false;

    this.createForm = this.emptyCreateForm();
  }

  createUser(): void {

    if (!this.isCreateFormValid()) {

      this.alertService.error(
        'Please complete all user fields.'
      );

      return;
    }

    this.submitting = true;
    const dto = {
      fullName: this.createForm.fullName,
      email: this.createForm.email,
      password: this.createForm.password,
      role: 'MEMBER'
    };

    this.userService.create(dto).subscribe({

      next: () => {

        this.submitting = false;

        this.alertService.success(
          'User created successfully as Member.'
        );

        this.closeCreateForm();

        this.loadUsers();
      },

      error: (err) => {

        this.submitting = false;

        console.error(
          'Error creating user:',
          err
        );

        this.alertService.error(
          err?.error?.message ||
          'User creation failed.'
        );
      }
    });
  }

  changeRole(
    user: any,
    event: Event
  ): void {

    if (!user?.id) {
      return;
    }

    const select =
      event.target as HTMLSelectElement;

    const newRole = select.value;

    if (!newRole) {
      return;
    }

    const oldRole = user.role;

    
    if (newRole === oldRole) {
      return;
    }

    const confirmed = confirm(
      `Change ${user.fullName}'s role from ` +
      `${this.roleLabel(oldRole)} to ` +
      `${this.roleLabel(newRole)}?`
    );

    if (!confirmed) {

      select.value = oldRole;

      return;
    }

    this.userService
      .updateRole(user.id, newRole)
      .subscribe({

        next: (updatedUser) => {
          user.role =
            updatedUser?.role ?? newRole;

          this.alertService.success(
            `${user.fullName}'s role has been updated successfully.`
          );
        },

        error: (err) => {

          console.error(
            'Error changing user role:',
            err
          );

          user.role = oldRole;

          select.value = oldRole;

          this.alertService.error(
            err?.error?.message ||
            'Unable to change user role.'
          );
        }
      });
  }

  deleteUser(user: any): void {

    if (!user?.id) {
      return;
    }

    const name =
      user.fullName ||
      user.email ||
      'this user';

    if (!confirm(`Delete ${name}?`)) {
      return;
    }

    this.userService
      .delete(user.id)
      .subscribe({

        next: () => {

          this.alertService.success(
            'User deleted successfully!'
          );

          this.loadUsers();
        },

        error: (err) => {

          console.error(
            'Error deleting user:',
            err
          );

          this.alertService.error(
            err?.error?.message ||
            'Unable to delete user.'
          );
        }
      });
  }

 
  get filteredUsers(): any[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    return this.users.filter((user) => {

      const roleMatches =
        this.roleFilter === 'ALL' ||
        user.role === this.roleFilter;

      const searchMatches =
        search === '' ||

        (user.fullName || '')
          .toLowerCase()
          .includes(search) ||

        (user.email || '')
          .toLowerCase()
          .includes(search);

      return roleMatches && searchMatches;
    });
  }


  get totalUsers(): number {
    return this.users.length;
  }

  get adminUsers(): number {

    return this.users.filter(
      user => user.role === 'ADMIN'
    ).length;
  }

  get managerUsers(): number {

    return this.users.filter(
      user => user.role === 'PROJECT_MANAGER'
    ).length;
  }

  get memberUsers(): number {

    return this.users.filter(
      user => user.role === 'MEMBER'
    ).length;
  }

  get isEmptyState(): boolean {

    return !this.loading &&
      this.filteredUsers.length === 0;
  }

 

  roleLabel(role: string): string {

    const labels: Record<string, string> = {

      ADMIN: 'Admin',

      PROJECT_MANAGER:
        'Project Manager',

      MEMBER: 'Member'
    };

    return labels[role] ||
      role ||
      'Unknown';
  }

  roleClass(role: string): string {

    const classes: Record<string, string> = {

      ADMIN: 'role-admin',

      PROJECT_MANAGER:
        'role-manager',

      MEMBER: 'role-member'
    };

    return classes[role] || '';
  }
 

  trackByUserId(
    index: number,
    user: any
  ): number {

    return user?.id ?? index;
  }

 

  private emptyCreateForm() {

    return {

      fullName: '',

      email: '',

      password: ''
    };
  }

  private isCreateFormValid(): boolean {

    return Boolean(

      this.createForm.fullName.trim() &&

      this.createForm.email.trim() &&

      this.createForm.password.trim()
    );
  }
}