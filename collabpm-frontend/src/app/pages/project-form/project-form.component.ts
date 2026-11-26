import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { ProjectService } from '../../services/project.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {

  isEdit = false;
  loading = false;
  error = '';
  projectId: number | null = null;

  form = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // EDIT MODE
      this.isEdit = true;
      this.projectId = +id;
      this.loadProject(+id);
      return;
    }

    // CREATE MODE
    // Only ADMIN can create a project
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/projects']);
    }
  }

  loadProject(id: number): void {
    this.loading = true;

    this.projectService.getById(id).subscribe({
      next: (data) => {
        this.form = {
          name: data.name || '',
          description: data.description || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          status: data.status || 'PLANNED'
        };

        this.loading = false;
      },

      error: (err) => {
        this.loading = false;
        console.error(err);

        this.alertService.error(
          err.userMessage || 'Failed to load project'
        );

        this.router.navigate(['/projects']);
      }
    });
  }

  onSubmit(): void {


    // VALIDATION
  
    if (!this.form.name?.trim()) {
      this.alertService.error('Project name is required');
      return;
    }

    if (!this.form.startDate) {
      this.alertService.error('Start date is required');
      return;
    }

    if (!this.form.endDate) {
      this.alertService.error('End date is required');
      return;
    }

    if (this.form.endDate < this.form.startDate) {
      this.alertService.error(
        'End date must be after start date'
      );
      return;
    }

   
    // UPDATE

    if (this.isEdit && this.projectId) {

      // ADMIN + PROJECT_MANAGER
      if (
        !this.authService.isAdmin() &&
        !this.authService.isProjectManager()
      ) {
        this.router.navigate(['/projects']);
        return;
      }

      this.loading = true;
      this.error = '';

      const dto = {
        name: this.form.name.trim(),
        description: this.form.description,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        status: this.form.status
      };

      this.projectService.update(this.projectId, dto).subscribe({

        next: () => {
          this.loading = false;

          this.alertService.success(
            'Project updated successfully!'
          );

          this.router.navigate(['/projects']);
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
    // Only ADMIN
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/projects']);
      return;
    }

    const user = this.authService.getUser();
    const ownerId = user?.id;

    if (!ownerId) {
      this.alertService.error(
        'User information not found'
      );
      return;
    }

    this.loading = true;
    this.error = '';

    const dto = {
      name: this.form.name.trim(),
      description: this.form.description,
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      status: this.form.status
    };

    this.projectService.create(dto, ownerId).subscribe({

      next: () => {
        this.loading = false;

        this.alertService.success(
          'Project created successfully!'
        );

        this.router.navigate(['/projects']);
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
    this.router.navigate(['/projects']);
  }
}