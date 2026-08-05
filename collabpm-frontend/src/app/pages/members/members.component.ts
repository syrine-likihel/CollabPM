import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { MemberCardComponent } from '../../components/member-card/member-card.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, FormsModule, MemberCardComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent {

  searchText = '';
  roleFilter = 'ALL';

  members = [
    { id: 1, fullName: 'Ahmed Test', email: 'ahmed@test.com', role: 'ADMIN', joinedAt: '2026-01-01', projects: 4, tasks: 12, avatar: 'AT', color: '#4F6EF7' },
    { id: 2, fullName: 'Sara Mansouri', email: 'sara@test.com', role: 'PROJECT_MANAGER', joinedAt: '2026-01-05', projects: 3, tasks: 8, avatar: 'SM', color: '#22C55E' },
    { id: 3, fullName: 'Karim Bel Haj', email: 'karim@test.com', role: 'MEMBER', joinedAt: '2026-01-08', projects: 2, tasks: 6, avatar: 'KB', color: '#F59E0B' },
    { id: 4, fullName: 'Rami Khelifi', email: 'rami@test.com', role: 'MEMBER', joinedAt: '2026-01-12', projects: 2, tasks: 5, avatar: 'RK', color: '#EF4444' },
    { id: 5, fullName: 'Leila Ben Ali', email: 'leila@test.com', role: 'MEMBER', joinedAt: '2026-02-01', projects: 1, tasks: 3, avatar: 'LB', color: '#8B5CF6' },
    { id: 6, fullName: 'Mohamed Trabelsi', email: 'mohamed@test.com', role: 'PROJECT_MANAGER', joinedAt: '2026-02-10', projects: 2, tasks: 7, avatar: 'MT', color: '#EC4899' },
  ];

  get filtered() {
    return this.members.filter(m => {
      const matchRole = this.roleFilter === 'ALL' || m.role === this.roleFilter;
      const matchSearch = this.searchText === '' ||
        m.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        m.email.toLowerCase().includes(this.searchText.toLowerCase());
      return matchRole && matchSearch;
    });
  }

  get counts() {
    return {
      all: this.members.length,
      admins: this.members.filter(m => m.role === 'ADMIN').length,
      managers: this.members.filter(m => m.role === 'PROJECT_MANAGER').length,
      members: this.members.filter(m => m.role === 'MEMBER').length,
    };
  }

  onRemove(id: number) {
    if (confirm('Remove this member?')) {
      this.members = this.members.filter(m => m.id !== id);
    }
  }
}