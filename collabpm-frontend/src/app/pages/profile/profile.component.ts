import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  activeTab = 'personal';

  user = {
    fullName: 'Ahmed Test',
    email: 'ahmed@test.com',
    role: 'ADMIN',
    joinedAt: '2026-01-01',
    avatar: 'AT',
    color: '#4F6EF7'
  };

  editForm = {
    fullName: 'Ahmed Test',
    email: 'ahmed@test.com',
    role: 'ADMIN'
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  stats = [
    { label: 'Projects', value: 4, icon: '📁' },
    { label: 'Tasks', value: 12, icon: '✅' },
    { label: 'Done', value: 8, icon: '🏆' },
    { label: 'Comments', value: 23, icon: '💬' },
  ];

  recentActivity = [
    { action: 'Created project', target: 'CollabPM App', time: '2 hours ago', icon: '📁' },
    { action: 'Completed task', target: 'Build CRUD APIs', time: '1 day ago', icon: '✅' },
    { action: 'Added comment', target: 'Build Auth JWT module', time: '2 days ago', icon: '💬' },
    { action: 'Created task', target: 'Setup CI/CD pipeline', time: '3 days ago', icon: '📝' },
    { action: 'Joined project', target: 'Mobile Dashboard', time: '5 days ago', icon: '🤝' },
  ];

  saveProfile() {
    this.user.fullName = this.editForm.fullName;
    this.user.email = this.editForm.email;
    alert('Profile updated successfully!');
  }

  changePassword() {
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    alert('Password changed successfully!');
    this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

  getRoleClass(role: string): string {
    const map: any = {
      'ADMIN': 'role-admin',
      'PROJECT_MANAGER': 'role-manager',
      'MEMBER': 'role-member'
    };
    return map[role] || '';
  }

  getRoleLabel(role: string): string {
    const map: any = {
      'ADMIN': 'Admin',
      'PROJECT_MANAGER': 'Project Manager',
      'MEMBER': 'Member'
    };
    return map[role] || role;
  }
}