import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {

  @Input() member: any;

  @Input() showRemove = false;

  @Output() onRemove = new EventEmitter<number>();

  getInitials(): string {
    if (!this.member?.userName) {
      return 'UN';
    }

    return this.member.userName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getAvatarColor(): string {

    const colors = [
      '#4F6EF7',
      '#22C55E',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6'
    ];

    const index =
      this.member?.id % colors.length || 0;

    return colors[index];
  }

  remove(): void {
    this.onRemove.emit(this.member.id);
  }
}