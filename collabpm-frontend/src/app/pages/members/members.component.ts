import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { MemberCardComponent } from '../../components/member-card/member-card.component';

import { MemberService } from '../../services/member.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FormsModule,
    MemberCardComponent
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {

  // =========================
  // FILTERS
  // =========================

  searchText = '';
  roleFilter = 'ALL';

  // =========================
  // DATA
  // =========================

  members: any[] = [];
  projects: any[] = [];
  users: any[] = [];

  selectedProjectId: number | null = null;

  loading = true;

  // =========================
  // INVITE FORM
  // =========================

  showInviteForm = false;

  inviteForm = {
    userId: '',
    projectId: '',
    roleInProject: 'Developer'
  };

  constructor(
    private memberService: MemberService,
    private projectService: ProjectService,
    private userService: UserService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadProjects();
    this.loadUsers();
  }

  // =========================
  // PERMISSIONS
  // =========================

  get canInvite(): boolean {
    return this.authService.isManagerOrAdmin();
  }

  get canRemove(): boolean {
    return this.authService.isAdmin();
  }

  // =========================
  // PROJECTS
  // =========================

  loadProjects(): void {

    this.loading = true;

    this.projectService.getAll().subscribe({

      next: (data) => {

        this.projects = data ?? [];

        if (this.projects.length > 0) {

          this.selectedProjectId = this.projects[0].id;

          // Keep invite form project synchronized
          this.inviteForm.projectId =
            String(this.selectedProjectId);

          // TypeScript knows here that selectedProjectId
          // is not null
          if (this.selectedProjectId !== null) {
            this.loadMembers(this.selectedProjectId);
          }

        } else {

          this.members = [];
          this.selectedProjectId = null;
          this.loading = false;

        }
      },

      error: (err) => {

        console.error(
          'Error loading projects:',
          err
        );

        this.projects = [];
        this.members = [];
        this.selectedProjectId = null;
        this.loading = false;

      }

    });
  }

  // =========================
  // USERS
  // =========================

  loadUsers(): void {

    this.userService.getAvailable().subscribe({

      next: (data) => {

        this.users = data ?? [];

      },

      error: (err) => {

        console.error(
          'Error loading users:',
          err
        );

        this.users = [];

      }

    });
  }

  // =========================
  // MEMBERS
  // =========================

  loadMembers(projectId: number): void {

    this.loading = true;

    this.memberService.getByProject(projectId).subscribe({

      next: (data) => {

        this.members = data ?? [];
        this.loading = false;

      },

      error: (err) => {

        console.error(
          'Error loading members:',
          err
        );

        this.members = [];
        this.loading = false;

      }

    });
  }

  // =========================
  // PROJECT CHANGE
  // =========================

  onProjectChange(event: Event): void {

    const value =
      (event.target as HTMLSelectElement).value;

    const projectId = Number(value);

    if (!projectId) {
      return;
    }

    this.selectedProjectId = projectId;

    // Keep invite form synchronized
    this.inviteForm.projectId =
      String(projectId);

    this.loadMembers(projectId);
  }

  // =========================
  // FILTER
  // =========================

  get filtered(): any[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    return this.members.filter(member => {

      const name =
        (member.userName || '')
          .toLowerCase();

      const email =
        (member.userEmail || '')
          .toLowerCase();

      const matchSearch =
        search === '' ||
        name.includes(search) ||
        email.includes(search);

      const matchRole =
        this.roleFilter === 'ALL' ||
        member.roleInProject === this.roleFilter;

      return matchSearch && matchRole;

    });
  }

  onInvite(): void {

    if (!this.canInvite) {
      return;
    }

    if (!this.inviteForm.userId) {

      this.alertService.error(
        'Please select a user.'
      );

      return;
    }

    if (!this.inviteForm.projectId) {

      this.alertService.error(
        'Please select a project.'
      );

      return;
    }

    if (
      !this.inviteForm.roleInProject.trim()
    ) {

      this.alertService.error(
        'Please enter a project role.'
      );

      return;
    }

    const projectId =
      Number(this.inviteForm.projectId);

    const userId =
      Number(this.inviteForm.userId);

    if (!projectId || !userId) {
      return;
    }

    const dto = {

      userId: userId,

      projectId: projectId,

      roleInProject:
        this.inviteForm.roleInProject.trim()

    };

    this.memberService.add(dto).subscribe({

      next: () => {

        this.alertService.success(
          'Member added successfully!'
        );

        this.showInviteForm = false;

        this.inviteForm = {

          userId: '',

          projectId: String(projectId),

          roleInProject: 'Developer'

        };
        this.selectedProjectId = projectId;
        this.loadMembers(projectId);

      },

      error: (err) => {

        console.error(
          'Error adding member:',
          err
        );

        this.alertService.error(
          err?.error?.message ||
          'Unable to add member.'
        );

      }

    });
  }


  // REMOVE ADMIN ONLY

  onRemove(memberId: number): void {

    if (!this.canRemove) {
      return;
    }

    this.memberService.remove(memberId).subscribe({

      next: () => {

        if (this.selectedProjectId !== null) {

          this.loadMembers(
            this.selectedProjectId
          );

        }

      },

      error: (err) => {

        console.error(
          'Error removing member:',
          err
        );

      }

    });
  }

  cancelInvite(): void {

    this.showInviteForm = false;

    this.inviteForm = {

      userId: '',

      projectId:
        this.selectedProjectId !== null
          ? String(this.selectedProjectId)
          : '',

      roleInProject: 'Developer'

    };
  }

}