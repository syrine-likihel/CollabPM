import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: '[app-task-card]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input() task: any;

  @Output() onDelete = new EventEmitter<number>();

  @Output() onStatusChange =
    new EventEmitter<{ id: number; status: string }>();

  constructor(
    public authService: AuthService
  ) {}

  getStatusClass(status: string): string {

    const map: any = {
      TO_DO: 'badge-todo',
      IN_PROGRESS: 'badge-progress',
      DONE: 'badge-done'
    };

    return map[status] || '';
  }

  getStatusLabel(status: string): string {

    const map: any = {
      TO_DO: 'To do',
      IN_PROGRESS: 'In progress',
      DONE: 'Done'
    };

    return map[status] || status;
  }

  getPriorityClass(priority: string): string {

    const map: any = {
      HIGH: 'prio-high',
      MEDIUM: 'prio-medium',
      LOW: 'prio-low'
    };

    return map[priority] || '';
  }
  changeStatus(event: Event): void {

    const value =
      (event.target as HTMLSelectElement).value;

    this.onStatusChange.emit({
      id: this.task.id,
      status: value
    });
  }

  delete(): void {
    this.onDelete.emit(this.task.id);
  }
  // PERMISSIONS
  
  get canEdit(): boolean {

    return (
      this.authService.isAdmin() ||
      this.authService.isProjectManager()
    );
  }

  
    //Only ADMIN can delete tasks.
   
  get canDelete(): boolean {

    return this.authService.isAdmin();
  }
  get canChangeStatus(): boolean {

    // ADMIN
    if (this.authService.isAdmin()) {
      return true;
    }

    // PROJECT_MANAGER
    if (this.authService.isProjectManager()) {
      return this.task?.canChangeStatus === true;
    }

    // MEMBER
    if (
      this.authService.getUser()?.role === 'MEMBER'
    ) {
      return this.task?.canChangeStatus === true;
    }

    return false;
  }
}