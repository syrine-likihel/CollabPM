import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {

  @Input() project: any;
  @Input() memberCount = 0;

  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<number>();

  constructor(
    public authService: AuthService
  ) {}

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANNED':
        return 'status-planned';

      case 'IN_PROGRESS':
        return 'status-progress';

      case 'COMPLETED':
        return 'status-completed';

      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PLANNED':
        return 'Planned';

      case 'IN_PROGRESS':
        return 'In Progress';

      case 'COMPLETED':
        return 'Completed';

      default:
        return status;
    }
  }

  edit(): void {
    this.onEdit.emit(this.project.id);
  }

  delete(): void {
    this.onDelete.emit(this.project.id);
  }
}