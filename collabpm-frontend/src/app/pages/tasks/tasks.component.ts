import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterLink, FormsModule, TaskCardComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  statusFilter = 'ALL';
  priorityFilter = 'ALL';
  searchText = '';

  tasks = [
    { id: 1, title: 'Build Auth JWT module', description: 'Implement Spring Security + JWT filter + BCrypt', project: 'CollabPM App', priority: 'HIGH', status: 'IN_PROGRESS', assignee: 'AT', assigneeName: 'Ahmed Test', due: '2026-07-15', overdue: false },
    { id: 2, title: 'Design Angular components', description: 'Build Dashboard, Kanban and Task UI components', project: 'CollabPM App', priority: 'MEDIUM', status: 'IN_PROGRESS', assignee: 'SM', assigneeName: 'Sara M.', due: '2026-07-20', overdue: false },
    { id: 3, title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for auto deployment', project: 'CollabPM App', priority: 'HIGH', status: 'TODO', assignee: 'RK', assigneeName: 'Rami K.', due: '2026-08-01', overdue: false },
    { id: 4, title: 'Database optimization', description: 'Add indexes on FK columns for better performance', project: 'API Integration', priority: 'HIGH', status: 'TODO', assignee: 'KB', assigneeName: 'Karim B.', due: '2026-01-05', overdue: true },
    { id: 5, title: 'Write unit tests', description: 'Cover service layer with JUnit 80%+', project: 'CollabPM App', priority: 'LOW', status: 'TODO', assignee: 'SM', assigneeName: 'Sara M.', due: '2026-08-10', overdue: false },
    { id: 6, title: 'Create JPA entities', description: 'User, Project, Task, Comment entities with relations', project: 'CollabPM App', priority: 'HIGH', status: 'DONE', assignee: 'AT', assigneeName: 'Ahmed Test', due: '2026-06-15', overdue: false },
    { id: 7, title: 'Setup MySQL database', description: 'Configure XAMPP + create collabpm_db database', project: 'CollabPM App', priority: 'HIGH', status: 'DONE', assignee: 'AT', assigneeName: 'Ahmed Test', due: '2026-06-10', overdue: false },
    { id: 8, title: 'Build CRUD APIs', description: 'REST endpoints for all 5 modules + Postman tests', project: 'CollabPM App', priority: 'MEDIUM', status: 'DONE', assignee: 'AT', assigneeName: 'Ahmed Test', due: '2026-06-30', overdue: false },
  ];

  get filtered() {
    return this.tasks.filter(t => {
      const matchStatus = this.statusFilter === 'ALL' || t.status === this.statusFilter;
      const matchPriority = this.priorityFilter === 'ALL' || t.priority === this.priorityFilter;
      const matchSearch = this.searchText === '' ||
        t.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        t.project.toLowerCase().includes(this.searchText.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });
  }

  get counts() {
    return {
      all: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'TODO').length,
      inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: this.tasks.filter(t => t.status === 'DONE').length,
      overdue: this.tasks.filter(t => t.overdue).length,
    };
  }

  onStatusChange(event: {id: number, status: string}) {
    const task = this.tasks.find(t => t.id === event.id);
    if (task) task.status = event.status;
  }

  onDelete(id: number) {
    if (confirm('Delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
    }
  }
}