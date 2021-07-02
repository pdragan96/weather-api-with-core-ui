import { Component, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { EsScrollHandler } from '../../base/es-scroll-handler';
import { tooltip } from './es-tooltip.animations';
import { TooltipPosition, TooltipTextAlignment } from './es-tooltip-type';


@Component({
  selector: 'es-tooltip',
  templateUrl: './es-tooltip.component.html',
  styleUrls: ['./es-tooltip.component.scss'],
  animations: [
    tooltip
  ]
})
export class EsTooltipComponent extends EsScrollHandler {
  @ViewChild('tooltipEl', { static: true }) tooltipEl: ElementRef;

  @Input() anchorElement: ElementRef;
  @Input() position: TooltipPosition;
  @Input() textAlignment: TooltipTextAlignment;
  @Input() text: string;
  @Input() title: string;
  @Input() isTooltipHidden: boolean;

  @Output() hide: EventEmitter<void>;

  tooltipState: string;
  tooltipVisible: boolean;

  originalTooltipWidth: number;
  originalTooltipHeight: number;

  pointerTop: string;
  pointerLeft: string;

  constructor(
    element: ElementRef,
    renderer: Renderer2
  ) {
    super(element, renderer);

    this.tooltipState = 'hidden';
    this.tooltipVisible = false;
    this.textAlignment = 'center';
    this.isTooltipHidden = false;

    this.hide = new EventEmitter<void>();
  }

  @HostListener('window:resize', [])
  onTooltipComponentWindowResize() {
    this.calculateOffsets();
  }

  showTooltip() {
    this.tooltipVisible = true;
    this.tooltipState = `${ this.position }`;
  }

  hideTooltip() {
    this.tooltipState = 'hidden';
    this.isTooltipHidden = true;
    this.tooltipVisible = false;
  }

  onAnimationStart(event: AnimationEvent) {
    if (event.toState === this.position) {
      const tooltipRect = this.tooltipEl.nativeElement.getBoundingClientRect();
      this.originalTooltipWidth = tooltipRect.width;
      this.originalTooltipHeight = tooltipRect.height;
      this.attachScrollEvents();
      this.calculateOffsets();
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    if (event.toState === 'hidden' && !this.tooltipVisible) {
      this.clearScrollEvents();
      this.hide.emit();
    }
  }

  calculateOffsets() {
    if (this.tooltipVisible) {
      const anchorElementRect = this.anchorElement.nativeElement.getBoundingClientRect();
      const documentRect = document.body.getBoundingClientRect();
      // const tooltipRect = this.tooltipEl.nativeElement.getBoundingClientRect();

      let topOffset = null;
      let rightOffset = null;
      let bottomOffset = null;
      let leftOffset = null;

      const tooltipMargin = 5;
      const viewPortMargin = 5;

      switch (this.position) {
        case 'top':
        case 'bottom':
          const elementWidthCenter = anchorElementRect.left + anchorElementRect.width / 2;
          const toolTipHalfWidth = this.originalTooltipWidth / 2;

          if (elementWidthCenter - toolTipHalfWidth < 0) {
            leftOffset = viewPortMargin;
          } else {
            leftOffset = elementWidthCenter - toolTipHalfWidth;
          }

          if (elementWidthCenter + toolTipHalfWidth > documentRect.width) {
            rightOffset = viewPortMargin;
          }

          if (this.position === 'top') {
            bottomOffset = documentRect.height - anchorElementRect.top + tooltipMargin;

            if (bottomOffset + this.originalTooltipHeight > documentRect.height) {
              topOffset = viewPortMargin;
            }
          } else if (this.position === 'bottom') {
            topOffset = anchorElementRect.top + anchorElementRect.height + tooltipMargin;

            if (topOffset + this.originalTooltipHeight > documentRect.height) {
              bottomOffset = viewPortMargin;
            }
          }
          break;
        case 'left':
        case 'right':
          const elementHeightCenter = anchorElementRect.top + anchorElementRect.height / 2;
          const toolTipHalfHeight = this.originalTooltipHeight / 2;

          if (elementHeightCenter - toolTipHalfHeight < 0) {
            topOffset = viewPortMargin;
          } else {
            topOffset = elementHeightCenter - toolTipHalfHeight;
          }

          if (elementHeightCenter + toolTipHalfHeight > documentRect.height) {
            bottomOffset = viewPortMargin;
          }

          if (this.position === 'left') {
            rightOffset = documentRect.width - anchorElementRect.left + tooltipMargin;

            if (rightOffset + this.originalTooltipWidth > documentRect.width) {
              leftOffset = viewPortMargin;
            }
          } else if (this.position === 'right') {
            leftOffset = anchorElementRect.right + tooltipMargin;

            if (anchorElementRect.left + anchorElementRect.width + tooltipMargin + this.originalTooltipWidth > documentRect.width) {
              rightOffset = viewPortMargin;
            }
          }
          break;
      }

      this.renderer.setStyle(this.tooltipEl.nativeElement, 'top', !topOffset ? 'auto' : `${ topOffset }px`);
      this.renderer.setStyle(this.tooltipEl.nativeElement, 'right', !rightOffset ? 'auto' : `${ rightOffset }px`);
      this.renderer.setStyle(this.tooltipEl.nativeElement, 'bottom', !bottomOffset ? 'auto' : `${ bottomOffset }px`);
      this.renderer.setStyle(this.tooltipEl.nativeElement, 'left', !leftOffset ? 'auto' : `${ leftOffset }px`);

      this.setPointerPosition();
    }
  }

  setPointerPosition() {
    this.pointerTop = 'auto';
    this.pointerLeft = 'auto';

    const anchorElementRect = this.anchorElement.nativeElement.getBoundingClientRect();
    // const documentRect = document.body.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.nativeElement.getBoundingClientRect();

    if (this.position === 'top' || this.position === 'bottom') {
      const elementWidthCenter = anchorElementRect.left + anchorElementRect.width / 2;
      // const toolTipHalfWidth = this.originalTooltipWidth / 2;

      this.pointerLeft = `${ tooltipRect.width - (tooltipRect.left + tooltipRect.width - elementWidthCenter) - 4 }px`;

      if (this.position === 'bottom') {
        this.pointerTop = '4px';
      }
    }

    if (this.position === 'left' || this.position === 'right') {
      const elementHeightCenter = anchorElementRect.top + anchorElementRect.height / 2;
      // const toolTipHalfHeight = this.originalTooltipHeight / 2;

      this.pointerTop = `${ tooltipRect.height - (tooltipRect.top + tooltipRect.height - elementHeightCenter + 4) }px`;

      if (this.position === 'right') {
        this.pointerLeft = '4px';
      }
    }
  }

  // from EsScrollHandler
  onScroll() {
    this.hideTooltip();
  }
}
