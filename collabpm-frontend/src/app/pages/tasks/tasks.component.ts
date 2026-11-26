import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    RouterLink,
    FormsModule,
    TaskCardComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  statusFilter = 'ALL';
  priorityFilter = 'ALL';
  searchText = '';

  tasks: any[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }
  

  loadTasks(): void {

    this.loading = true;

    this.taskService.getAll().subscribe({

      next: (data) => {

        this.tasks = data ?? [];

        this.loading = false;

      },

      error: (err) => {

        console.error('Tasks error:', err);

        this.tasks = [];

        this.loading = false;

      }

    });
  }
  
  get filtered(): any[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    return this.tasks.filter(task => {

      const matchStatus =
        this.statusFilter === 'ALL'
          ? true
          : this.statusFilter === 'OVERDUE'
            ? task.overdue === true
            : task.status === this.statusFilter;

     
      const matchPriority =
        this.priorityFilter === 'ALL' ||
        task.priority === this.priorityFilter;

  
      const matchSearch =
        search === '' ||
        (task.title || '')
          .toLowerCase()
          .includes(search) ||
        (task.projectName || '')
          .toLowerCase()
          .includes(search);

      return (
        matchStatus &&
        matchPriority &&
        matchSearch
      );
    });
  }


  get counts() {

    return {

      all: this.tasks.length,

      todo: this.tasks.filter(
        task => task.status === 'TO_DO'
      ).length,

      inProgress: this.tasks.filter(
        task => task.status === 'IN_PROGRESS'
      ).length,

      done: this.tasks.filter(
        task => task.status === 'DONE'
      ).length,

      overdue: this.tasks.filter(
        task => task.overdue === true
      ).length

    };
  }


  onStatusChange(
    event: {
      id: number;
      status: string;
    }
  ): void {

    const task = this.tasks.find(
      task => task.id === event.id
    );

    if (!task) {
      return;
    }

    if (
      this.authService.getUser()?.role === 'MEMBER'
    ) {

      const currentUserId =
        this.authService.getUser()?.id;

      if (task.assignedToId !== currentUserId) {

        console.warn(
          'Member cannot change the status of this task.'
        );

        return;
      }
    }

    this.taskService
      .changeStatus(
        event.id,
        event.status
      )
      .subscribe({

        next: () => {

          this.loadTasks();

        },

        error: (err) => {

          console.error(
            'Change status error:',
            err
          );

        }

      });
  }

  onDelete(id: number): void {
    
    if (!this.authService.isAdmin()) {
      return;
    }

    if (!confirm('Delete this task?')) {
      return;
    }

    this.taskService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadTasks();

        },

        error: (err) => {

          console.error(
            'Delete task error:',
            err
          );

        }

      });
  }

}