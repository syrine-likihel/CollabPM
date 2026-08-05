import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {

  @Input() member: any;
  @Output() onRemove = new EventEmitter<number>();

  getRoleLabel(role: string): string {
    const map: any = {
      'ADMIN': 'Admin',
      'PROJECT_MANAGER': 'Project Manager',
      'MEMBER': 'Member'
    };
    return map[role] || role;
  }

  getRoleClass(role: string): string {
    const map: any = {
      'ADMIN': 'role-admin',
      'PROJECT_MANAGER': 'role-manager',
      'MEMBER': 'role-member'
    };
    return map[role] || '';
  }

  remove() {
    this.onRemove.emit(this.member.id);
  }
}