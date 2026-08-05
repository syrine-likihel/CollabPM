import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {

  filter = 'ALL';

  constructor(private router: Router) {}

  projects = [
    { id: 1, name: 'CollabPM App', description: 'A full-stack project management application.', owner: 'Ahmed Test', startDate: '2026-01-01', endDate: '2026-12-31', status: 'IN_PROGRESS', progress: 65, members: ['AT', 'SM', 'KB'], tasks: 18, doneTasks: 12, late: false },
    { id: 2, name: 'Mobile Dashboard', description: 'Mobile-first dashboard for real-time analytics.', owner: 'Sara Mansouri', startDate: '2026-02-01', endDate: '2026-06-30', status: 'PLANNED', progress: 20, members: ['AT', 'RK'], tasks: 15, doneTasks: 3, late: false },
    { id: 3, name: 'API Integration', description: 'Third-party API integration for payment services.', owner: 'Karim Bel Haj', startDate: '2025-10-01', endDate: '2026-01-10', status: 'IN_PROGRESS', progress: 80, members: ['KB', 'AT'], tasks: 20, doneTasks: 16, late: true },
    { id: 4, name: 'Design System', description: 'Unified design system with reusable components.', owner: 'Ahmed Test', startDate: '2025-08-01', endDate: '2025-11-30', status: 'COMPLETED', progress: 100, members: ['AT', 'SM', 'LB'], tasks: 24, doneTasks: 24, late: false },
    { id: 5, name: 'E-Commerce Platform', description: 'Full e-commerce solution with cart and checkout.', owner: 'Rami Khelifi', startDate: '2026-03-01', endDate: '2026-09-30', status: 'PLANNED', progress: 5, members: ['RK', 'SM'], tasks: 32, doneTasks: 2, late: false },
    { id: 6, name: 'HR Management', description: 'Human resources management system.', owner: 'Leila Ben Ali', startDate: '2025-06-01', endDate: '2025-12-31', status: 'COMPLETED', progress: 100, members: ['LB', 'AT', 'KB'], tasks: 28, doneTasks: 28, late: false },
  ];

  get filteredProjects() {
    if (this.filter === 'ALL') return this.projects;
    if (this.filter === 'LATE') return this.projects.filter(p => p.late);
    return this.projects.filter(p => p.status === this.filter);
  }

  get counts() {
    return {
      all: this.projects.length,
      planned: this.projects.filter(p => p.status === 'PLANNED').length,
      inProgress: this.projects.filter(p => p.status === 'IN_PROGRESS').length,
      completed: this.projects.filter(p => p.status === 'COMPLETED').length,
      late: this.projects.filter(p => p.late).length,
    };
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects = this.projects.filter(p => p.id !== id);
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/projects/edit', id]);
  }
}