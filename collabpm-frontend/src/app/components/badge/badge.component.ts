import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: '<span>Badge</span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {}
