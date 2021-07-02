import { Component, Input } from '@angular/core';

export interface IEsTabComponentAccordionDataItem {
  header: string;
  content: string;
  list?: string[];
}

@Component({
  selector: 'es-tab',
  templateUrl: './es-tab.component.html',
  styleUrls: ['./es-tab.component.scss']
})
export class EsTabComponent {
  @Input() title: string;
  @Input() icon: string;
  @Input() active: boolean;
  @Input() accordionData: IEsTabComponentAccordionDataItem[];

  constructor() {
    this.title = null;
    this.icon = null;
    this.active = false;
    this.accordionData = [];
  }
}
