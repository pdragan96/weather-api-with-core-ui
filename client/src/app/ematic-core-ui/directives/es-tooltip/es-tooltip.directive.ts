import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Subscription } from 'rxjs';

import { EsTooltipComponent } from './component/es-tooltip.component';
import { TooltipPosition, TooltipTextAlignment } from './component/es-tooltip-type';

@Directive({
  selector: '[esTooltip]'
})
export class EsTooltipDirective implements OnDestroy {
  @Input() esTooltip: string;
  @Input() tooltipTitle: string;
  @Input() tooltipPosition: TooltipPosition;
  @Input() tooltipDisabled: boolean;
  @Input() tooltipTextAlignment: TooltipTextAlignment;
  @Input() isTooltipHidden: boolean;

  tooltipComponentRef: ComponentRef<EsTooltipComponent>;
  tooltipSubscription: Subscription;

  constructor(
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.esTooltip = null;
    this.tooltipTitle = null;
    this.tooltipPosition = 'bottom';
    this.tooltipDisabled = false;
    this.tooltipTextAlignment = 'center';
    this.isTooltipHidden = false;
  }

  showTooltip() {
    if (!this.tooltipDisabled) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EsTooltipComponent);
      this.tooltipComponentRef = this.viewContainerRef.createComponent(componentFactory);
      (<EsTooltipComponent>this.tooltipComponentRef.instance).anchorElement = this.element;
      (<EsTooltipComponent>this.tooltipComponentRef.instance).position = this.tooltipPosition;
      (<EsTooltipComponent>this.tooltipComponentRef.instance).textAlignment = this.tooltipTextAlignment;
      (<EsTooltipComponent>this.tooltipComponentRef.instance).text = this.esTooltip;
      (<EsTooltipComponent>this.tooltipComponentRef.instance).title = this.tooltipTitle;
      (<EsTooltipComponent>this.tooltipComponentRef.instance).isTooltipHidden = this.isTooltipHidden;

      (<EsTooltipComponent>this.tooltipComponentRef.instance).showTooltip();
      this.tooltipSubscription = (<EsTooltipComponent>this.tooltipComponentRef.instance).hide.subscribe(() => {
        this.viewContainerRef.clear();
      });
    }
  }

  hideTooltip() {
    if (this.tooltipComponentRef) {
      (<EsTooltipComponent>this.tooltipComponentRef.instance).hideTooltip();
    }
  }

  @HostListener('mouseenter', ['$event'])
  onTooltipDirectiveMouseEnter(event: MouseEvent) {
    this.showTooltip();
  }

  @HostListener('longpress', ['$event'])
  onTooltipDirectiveLongPress(event: MouseEvent) {
    this.showTooltip();
  }

  @HostListener('mouseleave', ['$event'])
  onTooltipDirectiveMouseLeave(event: MouseEvent) {
    this.hideTooltip();
  }

  @HostListener('touchend', ['$event'])
  onTooltipDirectiveTouchEnd(event: MouseEvent) {
    this.hideTooltip();
  }

  ngOnDestroy() {
    if (this.tooltipSubscription) {
      this.tooltipSubscription.unsubscribe();
    }
  }
}
