import { Directive, ElementRef, Renderer2 } from '@angular/core';

import { EsDropdownBaseDirective } from '../base/es-dropdown-base.directive';

@Directive({
  selector: '[esValidationMessage]'
})
export class EsValidationMessageDirective extends EsDropdownBaseDirective {

  constructor(element: ElementRef, renderer: Renderer2) {
    super(element, renderer);

    this.zIndex = 100;
  }

  calculateOffsets() {
    const rect = this.containerElement.nativeElement.getBoundingClientRect();
    const docRect = document.body.getBoundingClientRect();
    const topOffset = rect.top + rect.height + 2;
    // const availableHeight = docRect.height - topOffset;
    // const availableWidth = docRect.width;

    this.renderer.setStyle(this.element.nativeElement, 'top', `${topOffset}px`);
    this.renderer.setStyle(this.element.nativeElement, 'right', `${docRect.right - rect.right}px`);
    this.renderer.setStyle(this.element.nativeElement, 'left', `${rect.left}px`);
  }
}
