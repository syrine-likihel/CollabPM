import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';

import { ProjectService } from '../../services/project.service';
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    ProjectCardComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  filter = 'ALL';

  projects: any[] = [];

  loading = true;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private memberService: MemberService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {

    this.loading = true;

    this.projectService.getAll().subscribe({

      next: (data) => {

        const projects = data ?? [];

        if (projects.length === 0) {
          this.projects = [];
          this.loading = false;
          return;
        }

      
        const memberRequests = projects.map(project =>
          this.memberService.getByProject(project.id)
        );

        forkJoin(memberRequests).subscribe({

          next: (membersLists) => {

            this.projects = projects.map((project, index) => {

              const members = membersLists[index] ?? [];

              return {
                ...project,
                memberCount: members.length
              };

            });

            this.loading = false;
          },

          error: (err) => {

            console.error(
              'Error loading project members:',
              err
            );

          
            this.projects = projects.map(project => ({
              ...project,
              memberCount: 0
            }));

            this.loading = false;
          }

        });
      },

      error: (err) => {

        console.error(
          'Projects error:',
          err
        );

        this.projects = [];
        this.loading = false;
      }

    });
  }

  get filteredProjects(): any[] {

    if (this.filter === 'ALL') {
      return this.projects;
    }

    if (this.filter === 'LATE') {
      return this.projects.filter(
        p => p.late
      );
    }

    return this.projects.filter(
      p => p.status === this.filter
    );
  }

  get counts() {

    return {
      all: this.projects.length,

      planned: this.projects.filter(
        p => p.status === 'PLANNED'
      ).length,

      inProgress: this.projects.filter(
        p => p.status === 'IN_PROGRESS'
      ).length,

      completed: this.projects.filter(
        p => p.status === 'COMPLETED'
      ).length,

      late: this.projects.filter(
        p => p.late
      ).length
    };
  }

  onDelete(id: number): void {

    if (
      confirm(
        'Are you sure you want to delete this project?'
      )
    ) {

      this.projectService.delete(id).subscribe({

        next: () => {
          this.loadProjects();
        },

        error: (err) => {
          console.error(
            'Error deleting project:',
            err
          );
        }

      });
    }
  }

  onEdit(id: number): void {

    this.router.navigate([
      '/projects/edit',
      id
    ]);

  }
}