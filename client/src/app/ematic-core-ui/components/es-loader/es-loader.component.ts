import { Component, Input } from '@angular/core';

@Component({
  selector: 'es-loader',
  templateUrl: './es-loader.component.html',
  styleUrls: [ './es-loader.component.scss' ]
})
export class EsLoaderComponent {
  @Input() isRelative: boolean;
  @Input() small: boolean;

  constructor() {
    this.isRelative = false;
    this.small = false;
  }
}
