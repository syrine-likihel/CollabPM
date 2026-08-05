import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: '<div>Modal</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {}
