import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { accordionContent, expander } from './es-accordion-animations';

@Component({
  selector: 'es-accordion',
  templateUrl: './es-accordion.component.html',
  styleUrls: ['./es-accordion.component.scss'],
  animations: [
    accordionContent,
    expander
  ]
})
export class EsAccordionComponent implements OnInit, OnChanges {
  @Input() expanded: boolean;
  @Input() expandable: boolean;
  @Input() hasDetailsButton: boolean;
  @Input() hasPaddingTop: boolean;
  @Output() expand: EventEmitter<boolean>;
  @Output() refreshAccordion: EventEmitter<EsAccordionComponent>;

  animationTrigger: string;

  constructor() {
    this.expand = new EventEmitter<boolean>();
    this.refreshAccordion = new EventEmitter<EsAccordionComponent>();
    this.expanded = false;
    this.expandable = true;
    this.hasPaddingTop = true;
    this.animationTrigger = 'collapsed';
    this.hasDetailsButton = false;
  }

  ngOnInit() {
    this.refreshAccordion.emit(this);
  }

  ngOnChanges() {
    if (!this.expandable && this.expanded) {
      this.expanded = false;
    }

    this.animate();
  }

  animate() {
    this.animationTrigger = this.expanded ? 'expanded' : 'collapsed';
  }

  onAccordionExpand() {
    if (this.expandable) {
      this.expanded = !this.expanded;
      this.animate();
      this.expand.emit(this.expanded);
      this.refreshAccordion.emit(this);
    }
  }
}
