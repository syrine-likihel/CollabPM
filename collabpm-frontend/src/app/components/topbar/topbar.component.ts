import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

interface SearchResult {
  type: 'project' | 'task';
  id: number;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {

  @Input() pageTitle = '';
  @Input() pageSubtitle = '';
  @Input() buttonLabel = '';
  @Input() buttonLink = '';

  searchText = '';
  searchResults: SearchResult[] = [];

  private projects: any[] = [];
  private tasks: any[] = [];

  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadSearchData();
  }
  // LOAD DATA

  private loadSearchData(): void {

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data ?? [];
        this.search();
      },
      error: (err) => {
        console.error('Error loading projects for search:', err);
      }
    });

    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = data ?? [];
        this.search();
      },
      error: (err) => {
        console.error('Error loading tasks for search:', err);
      }
    });
  }

  
  // SEARCH
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.search();
  }

  private search(): void {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      this.searchResults = [];
      return;
    }

    const results: SearchResult[] = [];

    // PROJECTS
    this.projects
      .filter(project => {
        const name = (project.name || '').toLowerCase();
        const description = (project.description || '').toLowerCase();

        return (
          name.includes(search) ||
          description.includes(search)
        );
      })
      .slice(0, 5)
      .forEach(project => {
        results.push({
          type: 'project',
          id: project.id,
          title: project.name || 'Unnamed project',
          subtitle: project.description || 'Project'
        });
      });

    // TASKS
    this.tasks
      .filter(task => {
        const title = (task.title || '').toLowerCase();
        const description = (task.description || '').toLowerCase();
        const projectName = (task.projectName || '').toLowerCase();

        return (
          title.includes(search) ||
          description.includes(search) ||
          projectName.includes(search)
        );
      })
      .slice(0, 5)
      .forEach(task => {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title || 'Unnamed task',
          subtitle: task.projectName || 'Task'
        });
      });

    this.searchResults = results.slice(0, 8);
  }


  // OPEN RESULT
  openResult(result: SearchResult): void {

    this.searchText = '';
    this.searchResults = [];

    if (result.type === 'project') {
      this.router.navigate(['/projects']);
      return;
    }

    if (result.type === 'task') {
      this.router.navigate(['/tasks']);
    }
  }

 
  // CLOSE SEARCH
  clearSearch(): void {
    this.searchText = '';
    this.searchResults = [];
  }

}