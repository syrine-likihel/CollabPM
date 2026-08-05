import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: '<div>EmptyState</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {}
