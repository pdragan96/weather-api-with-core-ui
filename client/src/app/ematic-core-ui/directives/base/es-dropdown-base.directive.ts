import { ElementRef, OnInit, Input, OnDestroy, HostListener, Renderer2, AfterViewInit, Directive } from '@angular/core';

import { EsScrollHandler } from './es-scroll-handler';
import { constants } from '../../strings/constants';

@Directive()
export class EsDropdownBaseDirective extends EsScrollHandler implements OnInit, AfterViewInit, OnDestroy {

  @Input() containerElement: ElementRef;

  defaultHeight: number;
  defaultWidth: number;

  zIndex: number;

  constructor(element: ElementRef, renderer: Renderer2) {
    super(element, renderer);
    this.zIndex = window.innerWidth < constants.MEDIA_POINTS.MOBILE_BREAKPOINT ? 3000 : 1000;
  }

  ngOnInit() {
    this.renderer.setStyle(this.element.nativeElement, 'zIndex', this.zIndex);
    this.renderer.setStyle(this.element.nativeElement, 'position', 'fixed');

    this.renderer.setStyle(this.element.nativeElement, 'top', 'auto');
    this.renderer.setStyle(this.element.nativeElement, 'left', 'auto');
    this.renderer.setStyle(this.element.nativeElement, 'bottom', 'auto');
    this.renderer.setStyle(this.element.nativeElement, 'right', 'auto');
  }

  ngAfterViewInit() {
    const rect = this.element.nativeElement.getBoundingClientRect();
    this.defaultHeight = rect.height;
    this.defaultWidth = rect.width;

    this.attachScrollEvents();
    this.calculateOffsets();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResizeBaseDirective(event: Event): void {
    this.calculateOffsets();
  }

  onScroll() {
    this.calculateOffsets();
  }

  calculateOffsets() {
    throw new Error('Not Implemented');
  }

  ngOnDestroy() {
    this.clearScrollEvents();
  }
}
