import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
  Renderer2,
  ChangeDetectionStrategy
} from '@angular/core';

import { mask, modal } from './es-modal-animations';

@Component({
  selector: 'es-modal',
  templateUrl: './es-modal.component.html',
  styleUrls: ['./es-modal.component.scss'],
  animations: [
    mask,
    modal
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsModalComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('content') content: ElementRef;

  @Input() titleText: string;
  @Input() closable: boolean;
  @Input() backdropDismiss: boolean;

  @Output() closed: EventEmitter<any>;

  isOpened: boolean;
  originalHeight: number;
  originalWidth: number;

  topOffset: number;
  leftOffset: number;

  top: string;
  left: string;
  right: string;
  bottom: string;

  contentDivMaxHeight: number;
  contentDivMaxWidth: number;

  get maxHeight() {
    return this.contentDivMaxHeight ? `${this.contentDivMaxHeight}px` : 'auto';
  }

  get maxWidth() {
    return this.contentDivMaxWidth ? `${this.contentDivMaxWidth}px` : 'auto';
  }

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef) {
    this.closable = true;
    this.backdropDismiss = true;

    this.isOpened = false;
    this.top = '0';
    this.left = '0';
    this.right = 'auto';
    this.bottom = 'auto';

    this.closed = new EventEmitter<any>();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(): void {
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
    if (this.modal) {
      const modalRect = this.modal.nativeElement.getBoundingClientRect();
      const documentRect = document.documentElement.getBoundingClientRect();

      if (!this.originalWidth && !this.originalHeight) {
        this.originalWidth = modalRect.width;
        this.originalHeight = modalRect.height;
      }

      if (!this.contentDivMaxHeight && !this.contentDivMaxWidth) {
        const contentDivRect = this.content.nativeElement.getBoundingClientRect();
        this.contentDivMaxHeight = contentDivRect.height;
        this.contentDivMaxWidth = contentDivRect.width;
      }

      if (this.originalHeight > documentRect.height) {
        this.top = '0';
        this.bottom = '0';
      } else {
        this.topOffset = Math.floor((documentRect.height - modalRect.height) / 2);
        this.top = `${this.topOffset}px`;

        if (this.bottom !== 'auto') {
          this.bottom = 'auto';
        }
      }

      if (this.originalWidth > documentRect.width) {
        this.left = '0';
        this.right = '0';
      } else {
        this.leftOffset = Math.floor(documentRect.width / 2) - Math.floor(modalRect.width / 2);
        this.left = `${this.leftOffset}px`;

        if (this.right !== 'auto') {
          this.right = 'auto';
        }
      }
    }
  }

  onClose(): void {
    this.close();
  }

  onModalAnimationStart(): void {
    this.calculateOffsets();
  }

  onModalMaskClick(): void {
    if (this.backdropDismiss) {
      this.close();
    }
  }

  public open(): void {
    if (!this.isOpened) {
      this.isOpened = true;

      this.disableScrolling();
      this.changeDetectorRef.markForCheck();
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
}
