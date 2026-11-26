import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  userName = '';
  userRole = '';
  userInitials = '';

  menuItems: MenuItem[] = [
    {
      icon: '⊞',
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: '📁',
      label: 'Projects',
      path: '/projects'
    },
    {
      icon: '✓',
      label: 'Tasks',
      path: '/tasks'
    },
    {
      icon: '👤',
      label: 'Profile',
      path: '/profile'
    }
  ];

  constructor(
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {

    const user = this.authService.getUser();

    if (!user) {
      return;
    }

    this.userName = user.fullName || user.email || 'User';

    this.userRole = user.role || 'MEMBER';

    // User initials
    this.userInitials = this.userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name: string) => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // ADMIN + PROJECT_MANAGER

    if (
      this.userRole === 'ADMIN' ||
      this.userRole === 'PROJECT_MANAGER'
    ) {

      this.menuItems.push({
        icon: '👥',
        label: 'Members',
        path: '/members'
      });

    }
    // Users
    // ADMIN only
    if (this.userRole === 'ADMIN') {

      this.menuItems.push({
        icon: '👤',
        label: 'Users',
        path: '/users'
      });

    }

  }

  // Logout
  logout(): void {
    this.authService.logout();
  }

}