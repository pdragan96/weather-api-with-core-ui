import { Directive, ElementRef, OnDestroy, Input, Output, HostListener, EventEmitter, Renderer2 } from '@angular/core';

import { EsDropdownBaseDirective } from '../base/es-dropdown-base.directive';
import { constants } from '../../strings/constants';

export type DropdownAlignment = 'left' | 'right';

@Directive({
  selector: '[esDropdown]'
})
export class EsDropdownDirective extends EsDropdownBaseDirective implements OnDestroy {
  @Input() dropdownAlignment: DropdownAlignment;
  @Input() closable: boolean;
  @Input() disableTopDropdownAlignment: boolean;

  @Output() hide: EventEmitter<any>;
  @Output() pointerBottom: EventEmitter<boolean>;

  public destroyed: boolean;

  constructor(element: ElementRef, renderer: Renderer2) {
    super(element, renderer);

    this.dropdownAlignment = 'left';
    this.destroyed = false;
    this.closable = true;
    this.disableTopDropdownAlignment = false;

    this.hide = new EventEmitter<any>();
    this.pointerBottom = new EventEmitter<boolean>();
  }

  ngOnDestroy() {
    if (this.closable) {
      this.destroy();
    }
  }

  @HostListener('document:click', ['$event', '$event.target'])
  public onDocumentClickDropdownDirective(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.element.nativeElement.contains(targetElement);
    const clickedInsideContainerEl = this.containerElement.nativeElement.contains(targetElement);
    if (!clickedInside && !clickedInsideContainerEl && this.closable) {
      this.destroy();
    }
  }

  destroy() {
    if (!this.destroyed) {
      this.hide.emit();

      this.clearScrollEvents();

      this.destroyed = true;
    }
  }

  calculateOffsets() {
    const rect = this.containerElement.nativeElement.getBoundingClientRect();
    const containerRect = this.element.nativeElement.getBoundingClientRect();
    const topOffset = rect.top + rect.height;
    const availableHeight = window.innerHeight - topOffset;
    const availableWidth = window.innerWidth;

    this.renderer.setStyle(this.element.nativeElement, 'min-width', 'inherit');
    this.renderer.setStyle(this.element.nativeElement, 'min-height', 'inherit');

    this.renderer.setStyle(this.element.nativeElement, 'height', 'auto');
    this.renderer.setStyle(this.element.nativeElement, 'width', 'auto');

    if (window.innerWidth <= constants.MEDIA_POINTS.MOBILE_BREAKPOINT) {
      this.renderer.setStyle(this.element.nativeElement, 'top', '72px');
      this.renderer.setStyle(this.element.nativeElement, 'left', '5px');
      this.renderer.setStyle(this.element.nativeElement, 'right', '5px');
      this.renderer.setStyle(this.element.nativeElement, 'bottom', '42px');
    } else {
      if (!this.disableTopDropdownAlignment && topOffset + containerRect.height > window.innerHeight
        && topOffset - containerRect.height >= 0) {
        this.renderer.setStyle(this.element.nativeElement, 'top', `${ topOffset - containerRect.height - rect.height - 20 }px`);
        this.pointerBottom.emit(true);
      } else {
        this.renderer.setStyle(this.element.nativeElement, 'top', `${ topOffset }px`);
        this.pointerBottom.emit(false);
      }

      switch (this.dropdownAlignment) {
        case 'left':
          if (rect.left + this.defaultWidth >= availableWidth) {
            this.renderer.setStyle(this.element.nativeElement, 'right', `10px`);
            this.renderer.setStyle(this.element.nativeElement, 'width', `${ availableWidth - rect.left - 10 }px`);
            this.renderer.setStyle(this.element.nativeElement, 'height', `${ this.defaultHeight }px`);
          }

          this.renderer.setStyle(this.element.nativeElement, 'right', 'auto');
          this.renderer.setStyle(this.element.nativeElement, 'left', `${ rect.left }px`);
          break;
        case 'right':
          if (this.defaultWidth >= rect.right) {
            this.renderer.setStyle(this.element.nativeElement, 'left', `10px`);
            this.renderer.setStyle(this.element.nativeElement, 'width', `${ rect.right - 10 }px`);
            this.renderer.setStyle(this.element.nativeElement, 'height', `${ this.defaultHeight }px`);
          }

          this.renderer.setStyle(this.element.nativeElement, 'left', 'auto');
          this.renderer.setStyle(this.element.nativeElement, 'right', `${ availableWidth - rect.right }px`);
          break;
      }

      if (availableHeight <= this.defaultHeight) {
        // this.renderer.setStyle(this.element.nativeElement, 'bottom', `10px`);
        // this.renderer.setStyle(this.element.nativeElement, 'height', `${availableHeight - 10}px`);
      } else {
        this.renderer.setStyle(this.element.nativeElement, 'bottom', 'auto');
      }
    }
  }
}
