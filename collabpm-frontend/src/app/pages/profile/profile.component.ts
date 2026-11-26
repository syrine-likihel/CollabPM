import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  activeTab = 'personal';
  loading = false;
  successMsg = '';
  errorMsg = '';

  user: any = null;

  editForm = {
    fullName: '',
    email: '',
    role: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  stats = [
    { label: 'Projects', value: 0, icon: '📁' },
    { label: 'Tasks', value: 0, icon: '✅' },
    { label: 'Comments', value: 0, icon: '💬' },
  ];

  recentActivity = [
    { action: 'Logged in', target: 'CollabPM', time: 'Just now', icon: '🔑' },
    { action: 'Viewed dashboard', target: 'CollabPM', time: '1 min ago', icon: '📊' },
  ];

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.editForm = {
        fullName: this.user.fullName,
        email: this.user.email,
        role: this.user.role
      };
    }
  }

  getInitials(): string {
    if (!this.user?.fullName) return 'UN';
    return this.user.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getRoleLabel(role: string): string {
    const map: any = {
      'ADMIN': 'Admin',
      'PROJECT_MANAGER': 'Project Manager',
      'MEMBER': 'Member'
    };
    return map[role] || role;
  }

  getRoleClass(role: string): string {
    const map: any = {
      'ADMIN': 'role-admin',
      'PROJECT_MANAGER': 'role-manager',
      'MEMBER': 'role-member'
    };
    return map[role] || '';
  }

  saveProfile() {
    if (!this.editForm.fullName || !this.editForm.email) {
      this.errorMsg = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const updatedUser = {
      ...this.user,
      fullName: this.editForm.fullName,
      email: this.editForm.email,
      role: this.editForm.role,
      password: '--------'
    };

    this.userService.update(this.user.id, updatedUser).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Profile updated successfully!';

        // Update localStorage
        const stored = this.authService.getUser();
        stored.fullName = this.editForm.fullName;
        stored.email = this.editForm.email;
        localStorage.setItem('user', JSON.stringify(stored));
        this.user = stored;

        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Update failed';
      }
    });
  }

  changePassword() {
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
      this.errorMsg = 'Please fill in all fields';
      return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const dto = {
      fullName: this.user.fullName,
      email: this.user.email,
      role: this.user.role,
      password: this.passwordForm.newPassword
    };

    this.userService.update(this.user.id, dto).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Password changed successfully!';
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Password change failed';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}