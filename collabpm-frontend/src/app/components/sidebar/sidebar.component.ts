import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
    { icon: '📁', label: 'Projects', path: '/projects' },
    { icon: '✓', label: 'Tasks', path: '/tasks' },
    { icon: '👥', label: 'Members', path: '/members' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];
}