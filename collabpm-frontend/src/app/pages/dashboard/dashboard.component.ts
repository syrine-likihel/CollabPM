import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';

import { DashboardService } from '../../services/dashboard.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    RouterLink,
    StatCardComponent,
    ProjectCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  userName = '';
  loading = false;

  stats = [
    {
      label: 'Total Projects',
      value: 0,
      icon: '📁',
      color: 'blue',
      change: ''
    },
    {
      label: 'Active Tasks',
      value: 0,
      icon: '✅',
      color: 'gold',
      change: ''
    },
    {
      label: 'Overdue',
      value: 0,
      icon: '⚠️',
      color: 'red',
      change: 'Needs attention'
    },
    {
      label: 'Team Members',
      value: 0,
      icon: '👥',
      color: 'green',
      change: ''
    }
  ];

  projects: any[] = [];
  recentTasks: any[] = [];

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getFullName();

    this.loadStats();
    this.loadProjects();
    this.loadTasks();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats[0].value = data.totalProjects;
        this.stats[0].change = `${data.activeProjects} active`;

        this.stats[1].value = data.totalTasks;
        this.stats[1].change = `${data.inProgressTasks} in progress`;

        this.stats[2].value = data.overdueTasks;

        this.stats[3].value = data.totalUsers;
        this.stats[3].change = `${data.totalMembers} members`;
      },

      error: (err) => {
        console.error('Dashboard stats error:', err);
      }
    });
  }

  loadProjects(): void {
    this.loading = true;

    this.projectService.getAll().subscribe({
      next: (data) => {

       
        this.projects = (data ?? []).slice(0, 4);

       
        if (this.projects.length === 0) {
          this.loading = false;
          return;
        }

        
        const memberRequests = this.projects.map(project =>
          this.memberService.getByProject(project.id)
        );

        forkJoin(memberRequests).subscribe({
          next: (membersLists) => {

            this.projects = this.projects.map((project, index) => ({
              ...project,
              memberCount: membersLists[index]?.length ?? 0
            }));

            this.loading = false;
          },

          error: (err) => {
            console.error('Members count error:', err);

            this.projects = this.projects.map(project => ({
              ...project,
              memberCount: 0
            }));

            this.loading = false;
          }
        });
      },

      error: (err) => {
        console.error('Projects error:', err);
        this.loading = false;
      }
    });
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.recentTasks = (data ?? []).slice(0, 5);
      },

      error: (err) => {
        console.error('Tasks error:', err);
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Delete this project?')) {

      this.projectService.delete(id).subscribe({
        next: () => {
          this.loadProjects();
        },

        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/projects/edit', id]);
  }

  getTaskStatusClass(status: string): string {

    const map: any = {
      'TODO': 'badge-todo',
      'IN_PROGRESS': 'badge-progress',
      'DONE': 'badge-done'
    };

    return map[status] || '';
  }

  getTaskStatusLabel(status: string): string {

    const map: any = {
      'TODO': 'To do',
      'IN_PROGRESS': 'In progress',
      'DONE': 'Done'
    };

    return map[status] || status;
  }

  getPriorityClass(priority: string): string {

    const map: any = {
      'HIGH': 'prio-high',
      'MEDIUM': 'prio-medium',
      'LOW': 'prio-low'
    };

    return map[priority] || '';
  }
}