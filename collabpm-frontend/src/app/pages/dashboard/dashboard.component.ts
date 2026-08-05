import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { Router } from '@angular/router';
constructor(private router: Router) {}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterLink, StatCardComponent, ProjectCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  stats = [
    { label: 'Total Projects', value: 12, icon: '📁', color: 'blue', change: '+3 this month' },
    { label: 'Active Tasks', value: 47, icon: '✅', color: 'gold', change: '18 in progress' },
    { label: 'Overdue', value: 5, icon: '⚠️', color: 'red', change: 'Needs attention' },
    { label: 'Team Members', value: 8, icon: '👥', color: 'green', change: '+2 this week' },
  ];

  projects = [
    { id: 1, name: 'CollabPM App', description: 'A full-stack project management application.', owner: 'Ahmed Test', startDate: '2026-01-01', endDate: '2026-12-31', status: 'IN_PROGRESS', progress: 65, members: ['AT', 'SM', 'KB'], tasks: 18, doneTasks: 12, late: false },
    { id: 2, name: 'Mobile Dashboard', description: 'Mobile-first dashboard for real-time analytics.', owner: 'Sara Mansouri', startDate: '2026-02-01', endDate: '2026-06-30', status: 'PLANNED', progress: 20, members: ['AT', 'RK'], tasks: 15, doneTasks: 3, late: false },
    { id: 3, name: 'API Integration', description: 'Third-party API integration for payment services.', owner: 'Karim Bel Haj', startDate: '2025-10-01', endDate: '2026-01-10', status: 'IN_PROGRESS', progress: 80, members: ['KB', 'AT'], tasks: 20, doneTasks: 16, late: true },
  ];

  recentTasks = [
    { title: 'Build Auth JWT module', project: 'CollabPM App', priority: 'HIGH', status: 'IN_PROGRESS', assignee: 'AT', due: 'Jul 15' },
    { title: 'Design Angular components', project: 'CollabPM App', priority: 'MEDIUM', status: 'IN_PROGRESS', assignee: 'SM', due: 'Jul 20' },
    { title: 'Setup CI/CD pipeline', project: 'CollabPM App', priority: 'HIGH', status: 'TODO', assignee: 'RK', due: 'Aug 1' },
    { title: 'Database optimization', project: 'API Integration', priority: 'HIGH', status: 'TODO', assignee: 'KB', due: 'Jan 5' },
    { title: 'Write unit tests', project: 'CollabPM App', priority: 'LOW', status: 'TODO', assignee: 'SM', due: 'Aug 10' },
  ];

  onDelete(id: number) {
    if (confirm('Delete this project?')) {
      this.projects = this.projects.filter(p => p.id !== id);
    }
  }

  onEdit(id: number) {
     this.router.navigate(['/projects/edit', id]);
   }

  getTaskStatusClass(status: string): string {
    const map: any = { 'TODO': 'badge-todo', 'IN_PROGRESS': 'badge-progress', 'DONE': 'badge-done' };
    return map[status] || '';
  }

  getTaskStatusLabel(status: string): string {
    const map: any = { 'TODO': 'To do', 'IN_PROGRESS': 'In progress', 'DONE': 'Done' };
    return map[status] || status;
  }

  getPriorityClass(priority: string): string {
    const map: any = { 'HIGH': 'prio-high', 'MEDIUM': 'prio-medium', 'LOW': 'prio-low' };
    return map[priority] || '';
  }
}