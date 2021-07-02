import { Component, QueryList, ContentChildren, AfterContentInit, Input } from '@angular/core';

import { EsTabComponent } from '../es-tab/es-tab.component';

@Component({
  selector: 'es-tabs',
  templateUrl: './es-tabs.component.html',
  styleUrls: ['./es-tabs.component.scss']
})
export class EsTabsComponent implements AfterContentInit {
  @ContentChildren(EsTabComponent) tabs: QueryList<EsTabComponent>;
  @Input() isHorizontalTab: boolean;

  constructor() {
    this.isHorizontalTab = false;
  }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: EsTabComponent) {
    this.tabs.toArray().forEach(item => item.active = false);
    tab.active = true;
  }
}
