import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: '<div>SearchBar</div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {}
