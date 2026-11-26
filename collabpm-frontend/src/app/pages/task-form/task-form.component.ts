import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { MemberService } from '../../services/member.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  isEdit = false;
  loading = false;
  error = '';

  taskId: number | null = null;

  projects: any[] = [];
  members: any[] = [];

  form = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TO_DO',
    dueDate: '',
    projectId: '',
    assignedToId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService,
    private memberService: MemberService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    // MEMBER cannot access Create/Edit Task form
    if (!this.authService.isAdmin() &&
        !this.authService.isProjectManager()) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.loadProjects();

    if (id) {
      this.isEdit = true;
      this.taskId = +id;
      this.loadTask(+id);
    }
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data ?? [];
      },

      error: (err) => {
        console.error('Error loading projects:', err);
        this.projects = [];
      }
    });
  }

  loadMembers(projectId: number): void {

    this.members = [];

    this.memberService.getByProject(projectId).subscribe({
      next: (data) => {
        this.members = data ?? [];
        console.log('Members loaded:', this.members);
      },

      error: (err) => {
        console.error(
          'Error loading project members:',
          err
        );

        this.members = [];
      }
    });
  }

  onProjectChange(): void {

    if (!this.form.projectId) {
      this.members = [];
      this.form.assignedToId = '';
      return;
    }

    const projectId = Number(this.form.projectId);

    this.form.assignedToId = '';

    this.loadMembers(projectId);
  }

  loadTask(id: number): void {

    this.loading = true;

    this.taskService.getById(id).subscribe({

      next: (data) => {

        this.form = {
          title: data.title || '',
          description: data.description || '',
          priority: data.priority || 'MEDIUM',
          status: data.status || 'TO_DO',
          dueDate: data.dueDate || '',
          projectId: data.projectId
            ? String(data.projectId)
            : '',
          assignedToId: data.assignedToId
            ? String(data.assignedToId)
            : ''
        };

        this.loading = false;

        if (data.projectId) {
          this.loadMembers(
            Number(data.projectId)
          );
        }
      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.alertService.error(
          err.userMessage || 'Failed to load task'
        );

        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {

   
    // VALIDATION
   

    if (!this.form.title?.trim()) {
      this.alertService.error(
        'Task title is required'
      );
      return;
    }

    if (!this.form.projectId) {
      this.alertService.error(
        'Please select a project'
      );
      return;
    }

    if (!this.form.dueDate) {
      this.alertService.error(
        'Due date is required'
      );
      return;
    }

    
    // PERMISSION
   

    if (!this.authService.isAdmin() &&
        !this.authService.isProjectManager()) {

      this.router.navigate(['/tasks']);
      return;
    }

    this.loading = true;
    this.error = '';

    const dto = {
      title: this.form.title.trim(),
      description: this.form.description,
      priority: this.form.priority,
      status: this.form.status,
      dueDate: this.form.dueDate,
      projectId: Number(this.form.projectId),
      assignedToId: this.form.assignedToId
        ? Number(this.form.assignedToId)
        : null
    };

    console.log('Task DTO:', dto);

    
    // UPDATE
   

    if (this.isEdit && this.taskId) {

      this.taskService.update(
        this.taskId,
        dto
      ).subscribe({

        next: () => {

          this.loading = false;

          this.alertService.success(
            'Task updated successfully!'
          );

          this.router.navigate(['/tasks']);
        },

        error: (err) => {

          this.loading = false;

          console.error(err);

          this.alertService.error(
            err.userMessage || 'Update failed'
          );
        }
      });

      return;
    }

    
    // CREATE
    

    this.taskService.create(dto).subscribe({

      next: () => {

        this.loading = false;

        this.alertService.success(
          'Task created successfully!'
        );

        this.router.navigate(['/tasks']);
      },

      error: (err) => {

        this.loading = false;

        console.error(err);

        this.alertService.error(
          err.userMessage || 'Creation failed'
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}