import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
  Renderer2,
  OnDestroy
} from '@angular/core';

import { drawer } from './es-drawer-animation';
import { constants } from '../../strings/constants';

@Component({
  selector: 'es-drawer',
  templateUrl: './es-drawer.component.html',
  styleUrls: ['./es-drawer.component.scss'],
  animations: [
    drawer
  ]
})
export class EsDrawerComponent implements OnDestroy {
  @ViewChild('drawer') drawer: ElementRef;
  @ViewChild('content') content: ElementRef;

  @Input() titleText: string;
  @Input() closable: boolean;
  @Input() width: number;

  @Output() closed: EventEmitter<any>;

  @Output() opened: EventEmitter<any>;

  isOpened: boolean;

  contentDivMaxHeight: number;
  contentDivMaxWidth: number;

  top: string;
  left: string;
  right: string;
  bottom: string;

  get maxHeight() {
    return this.contentDivMaxHeight ? `${ this.contentDivMaxHeight }px` : 'auto';
  }

  get maxWidth() {
    const bodyRect = document.body.getBoundingClientRect();

    if (this.width && bodyRect.width <= constants.MEDIA_POINTS.TABLET_BREAKPOINT) {
      return '100%';
    } else if (this.width && bodyRect.width <= constants.MEDIA_POINTS.LARGE_SCREEN) {
      return '70%';
    } else {
      return this.width ? `${ this.width }%` : (this.contentDivMaxWidth ? `${ this.contentDivMaxWidth }px` : 'auto');
    }
  }

  constructor(
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.top = '0';
    this.left = 'auto';
    this.right = '0';
    this.bottom = '0';

    this.closable = true;
    this.closed = new EventEmitter<any>();
    this.opened = new EventEmitter<any>();
  }

  @HostListener('document:mousedown', ['$event'])
  public onClickOut(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('window:resize', ['$event'])
  public onModalResize(event: Event): void {
    if (this.isOpened) {
      this.calculateOffsets();
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onModalKeyDown(event: KeyboardEvent): void {
    if (this.isOpened) {
      switch (event.which || event.keyCode) {
        case 27: // esc
          this.close();
          event.preventDefault();
          break;
      }
    }
  }

  enableScrolling() {
    this.renderer.setStyle(document.body, 'overflow', 'visible');
  }

  disableScrolling() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  calculateOffsets(): void {
    if (!this.drawer) {
      return;
    }

    const bodyRect = document.body.getBoundingClientRect();

    // If on mobile
    if (bodyRect.width <= constants.MEDIA_POINTS.MOBILE_BREAKPOINT) {
      this.contentDivMaxHeight = bodyRect.height;
      this.contentDivMaxWidth = bodyRect.width;
      return;
    }

    const drawerParent = this.drawer.nativeElement.parentElement.parentElement;
    const drawerParentRect = drawerParent.getBoundingClientRect();

    this.contentDivMaxHeight = drawerParentRect.height || bodyRect.height;
    this.contentDivMaxWidth = drawerParentRect.width / 4;
  }

  onClose(): void {
    this.close();
  }

  onModalAnimationStart() {
    this.calculateOffsets();
  }

  public open(params?: any): void {
    if (!this.isOpened) {
      this.isOpened = true;

      this.disableScrolling();
      this.changeDetectorRef.markForCheck();

      this.opened.emit(params);
    }
  }

  public close(params?: any): void {
    if (this.isOpened && this.closable) {
      this.isOpened = false;

      this.enableScrolling();
      this.changeDetectorRef.markForCheck();

      this.closed.emit(params);
    }
  }

  ngOnDestroy() {
    this.enableScrolling();
  }
}
