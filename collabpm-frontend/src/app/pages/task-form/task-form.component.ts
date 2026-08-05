import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, FormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  isEdit = false;
  loading = false;
  error = '';

  form = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    projectId: '',
    assignedToId: ''
  };

  projects = [
    { id: 1, name: 'CollabPM App' },
    { id: 2, name: 'Mobile Dashboard' },
    { id: 3, name: 'API Integration' },
    { id: 4, name: 'Design System' },
    { id: 5, name: 'E-Commerce Platform' },
  ];

  members = [
    { id: 1, name: 'Ahmed Test', avatar: 'AT' },
    { id: 2, name: 'Sara Mansouri', avatar: 'SM' },
    { id: 3, name: 'Karim Bel Haj', avatar: 'KB' },
    { id: 4, name: 'Rami Khelifi', avatar: 'RK' },
    { id: 5, name: 'Leila Ben Ali', avatar: 'LB' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.form = {
        title: 'Build Auth JWT module',
        description: 'Implement Spring Security + JWT filter + BCrypt password hashing',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: '2026-07-15',
        projectId: '1',
        assignedToId: '1'
      };
    }
  }

  onSubmit() {
    if (!this.form.title || !this.form.dueDate || !this.form.projectId) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/tasks']);
    }, 800);
  }

  onCancel() {
    this.router.navigate(['/tasks']);
  }
}