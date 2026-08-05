import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterLink, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {

  projectName = 'CollabPM App';

  columns = [
    {
      id: 'TODO',
      label: 'To Do',
      color: '#9CA3AF',
      tasks: [
        { id: 3, title: 'Setup CI/CD pipeline', desc: 'Configure GitHub Actions for auto deployment', priority: 'HIGH', assignee: 'RK', due: 'Aug 1' },
        { id: 4, title: 'Database optimization', desc: 'Add indexes on FK columns for better performance', priority: 'HIGH', assignee: 'KB', due: 'Jan 5' },
        { id: 5, title: 'Write unit tests', desc: 'Cover service layer with JUnit 80%+', priority: 'LOW', assignee: 'SM', due: 'Aug 10' },
        { id: 10, title: 'Mobile responsive design', desc: 'Make all pages responsive for mobile', priority: 'MEDIUM', assignee: 'SM', due: 'Apr 30' },
      ]
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      color: '#4F6EF7',
      tasks: [
        { id: 1, title: 'Build Auth JWT module', desc: 'Spring Security + JWT filter + BCrypt password hashing', priority: 'HIGH', assignee: 'AT', due: 'Jul 15' },
        { id: 2, title: 'Design Angular components', desc: 'Build Dashboard, Kanban and Task UI components', priority: 'MEDIUM', assignee: 'SM', due: 'Jul 20' },
        { id: 9, title: 'Payment gateway integration', desc: 'Integrate Stripe payment API for checkout', priority: 'HIGH', assignee: 'RK', due: 'May 1' },
      ]
    },
    {
      id: 'DONE',
      label: 'Done',
      color: '#22C55E',
      tasks: [
        { id: 6, title: 'Create JPA entities', desc: 'User, Project, Task, Comment entities with relations', priority: 'HIGH', assignee: 'AT', due: 'Jun 15' },
        { id: 7, title: 'Setup MySQL database', desc: 'Configure XAMPP + create collabpm_db database', priority: 'HIGH', assignee: 'AT', due: 'Jun 10' },
        { id: 8, title: 'Build CRUD APIs', desc: 'REST endpoints for all 5 modules + Postman tests', priority: 'MEDIUM', assignee: 'AT', due: 'Jun 30' },
      ]
    }
  ];

  getPriorityClass(priority: string): string {
    const map: any = { 'HIGH': 'prio-high', 'MEDIUM': 'prio-medium', 'LOW': 'prio-low' };
    return map[priority] || '';
  }

  getPriorityLabel(priority: string): string {
    const map: any = { 'HIGH': 'High', 'MEDIUM': 'Medium', 'LOW': 'Low' };
    return map[priority] || priority;
  }

  moveTask(task: any, fromColId: string, toColId: string) {
    const fromCol = this.columns.find(c => c.id === fromColId);
    const toCol = this.columns.find(c => c.id === toColId);
    if (!fromCol || !toCol) return;
    fromCol.tasks = fromCol.tasks.filter(t => t.id !== task.id);
    toCol.tasks.push(task);
  }

  deleteTask(colId: string, taskId: number) {
    if (confirm('Delete this task?')) {
      const col = this.columns.find(c => c.id === colId);
      if (col) col.tasks = col.tasks.filter(t => t.id !== taskId);
    }
  }

  getAvatarColor(initials: string): string {
    const colors: any = {
      'AT': '#4F6EF7', 'SM': '#22C55E',
      'KB': '#F59E0B', 'RK': '#EF4444', 'LB': '#8B5CF6'
    };
    return colors[initials] || '#4F6EF7';
  }
}