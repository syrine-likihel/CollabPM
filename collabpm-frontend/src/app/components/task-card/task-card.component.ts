import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input() task: any;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onStatusChange = new EventEmitter<{id: number, status: string}>();

  getStatusClass(status: string): string {
    const map: any = {
      'TODO': 'badge-todo',
      'IN_PROGRESS': 'badge-progress',
      'DONE': 'badge-done'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
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

  changeStatus(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.onStatusChange.emit({ id: this.task.id, status: value });
  }

  delete() {
    this.onDelete.emit(this.task.id);
  }
}