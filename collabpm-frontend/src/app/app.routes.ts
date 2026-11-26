import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectFormComponent } from './pages/project-form/project-form.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { MembersComponent } from './pages/members/members.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'projects/new', component: ProjectFormComponent, canActivate: [authGuard] },
  { path: 'projects/edit/:id', component: ProjectFormComponent, canActivate: [authGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [authGuard] },
  { path: 'tasks/edit/:id', component: TaskFormComponent, canActivate: [authGuard] },
  {path: 'kanban/:projectId',component: KanbanComponent,canActivate: [authGuard]},
  { path: 'members', component: MembersComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'comments/:taskId', component: CommentsComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];