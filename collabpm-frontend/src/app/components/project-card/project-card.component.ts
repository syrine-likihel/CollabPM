import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {

  @Input() project: any;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<number>();

  getStatusLabel(status: string): string {
    const map: any = {
      'PLANNED': 'Planned',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: any = {
      'PLANNED': 'badge-planned',
      'IN_PROGRESS': 'badge-progress',
      'COMPLETED': 'badge-done'
    };
    return map[status] || '';
  }

  delete() {
    this.onDelete.emit(this.project.id);
  }

  edit() {
    this.onEdit.emit(this.project.id);
  }
}