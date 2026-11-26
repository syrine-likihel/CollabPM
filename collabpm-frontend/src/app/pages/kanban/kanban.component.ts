import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FormsModule
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent implements OnInit {

  projects: any[] = [];

  selectedProjectId: number | null = null;

  projectName = '';

  loading = false;

  columns = [
    {
      id: 'TO_DO',
      label: 'To Do',
      color: '#9CA3AF',
      tasks: [] as any[]
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      color: '#4F6EF7',
      tasks: [] as any[]
    },
    {
      id: 'DONE',
      label: 'Done',
      color: '#22C55E',
      tasks: [] as any[]
    }
  ];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const projectId = Number(params.get('projectId'));

    this.loadProjects(projectId);
  });
}

loadProjects(projectId: number): void {

  this.projectService.getAll().subscribe({

    next: (data) => {

      this.projects = data ?? [];

      const selectedProject = this.projects.find(
        project => project.id === projectId
      );

      if (selectedProject) {

        this.selectedProjectId = selectedProject.id;

        this.projectName = selectedProject.name;

        this.loadKanban(selectedProject.id);

      } else {

        console.error(
          'Project not found:',
          projectId
        );

        this.selectedProjectId = null;
        this.projectName = '';

        this.columns.forEach(col => {
          col.tasks = [];
        });
      }
    },

    error: (err) => {
      console.error(
        'Projects loading error:',
        err
      );
    }

  });
}

  onProjectChange(id: number): void {

  this.selectedProjectId = id;

  const project = this.projects.find(
    p => p.id === id
  );

  this.projectName = project?.name || '';

  if (id) {
    this.loadKanban(id);
  }
}

  loadKanban(projectId: number): void {

    this.loading = true;

    this.taskService.getKanban(projectId).subscribe({

      next: (data) => {

        this.columns[0].tasks = data?.todo ?? [];

        this.columns[1].tasks = data?.inProgress ?? [];

        this.columns[2].tasks = data?.done ?? [];

        this.loading = false;

      },

      error: (err) => {

        console.error(
          'Kanban loading error:',
          err
        );

        this.columns[0].tasks = [];
        this.columns[1].tasks = [];
        this.columns[2].tasks = [];

        this.loading = false;

      }

    });

  }

  moveTask(
    task: any,
    fromColId: string,
    toColId: string
  ): void {

    this.taskService
      .changeStatus(task.id, toColId)
      .subscribe({

        next: () => {

          if (this.selectedProjectId) {

            this.loadKanban(
              this.selectedProjectId
            );

          }

        },

        error: (err) => {

          console.error(
            'Change status error:',
            err
          );

        }

      });

  }

  deleteTask(taskId: number): void {

    if (!confirm('Delete this task?')) {
      return;
    }

    this.taskService
      .delete(taskId)
      .subscribe({

        next: () => {

          if (this.selectedProjectId) {

            this.loadKanban(
              this.selectedProjectId
            );

          }

        },

        error: (err) => {

          console.error(
            'Delete task error:',
            err
          );

        }

      });

  }

  getPriorityClass(priority: string): string {

    const map: any = {
      HIGH: 'prio-high',
      MEDIUM: 'prio-medium',
      LOW: 'prio-low'
    };

    return map[priority] || '';

  }

  getPriorityLabel(priority: string): string {

    const map: any = {
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low'
    };

    return map[priority] || priority;

  }

  getAvatarInitials(name: string): string {

    if (!name) {
      return 'UN';
    }

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  }

}