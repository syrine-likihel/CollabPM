import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, FormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {

  isEdit = false;
  loading = false;
  error = '';

  form = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      // Simulate loading existing project
      this.form = {
        name: 'CollabPM App',
        description: 'A full-stack project management application built with Spring Boot and Angular.',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: 'IN_PROGRESS'
      };
    }
  }

  onSubmit() {
    if (!this.form.name || !this.form.startDate || !this.form.endDate) {
      this.error = 'Please fill in all required fields';
      return;
    }
    if (this.form.endDate < this.form.startDate) {
      this.error = 'End date must be after start date';
      return;
    }

    this.loading = true;
    this.error = '';

    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/projects']);
    }, 800);
  }

  onCancel() {
    this.router.navigate(['/projects']);
  }
}