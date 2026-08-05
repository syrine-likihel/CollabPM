import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: '<div>ConfirmDialog</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {}
