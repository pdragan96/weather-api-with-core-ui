import { Component, OnInit, Input, Output, EventEmitter,
  ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'es-field',
  templateUrl: './es-field.component.html',
  styleUrls: ['./es-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsFieldComponent implements OnInit {
  @ViewChild('container', { static: true }) validationContainer: ElementRef;

  @Input() showErrorMessage: boolean;
  @Input() errorMessage: string;

  @Input() showClearIcon: boolean;
  @Input() showCopyIcon: boolean;

  @Input() isRounded: boolean;

  @Output() clear: EventEmitter<void>;
  @Output() copyValue: EventEmitter<void>;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;

    this.showErrorMessage = false;
    this.errorMessage = null;

    this.showClearIcon = true;
    this.clear = new EventEmitter<void>();

    this.isRounded = false;

    this.showCopyIcon = false;
    this.copyValue = new EventEmitter<void>();
  }

  ngOnInit() {
  }

  onClearClicked() {
    this.clear.emit();
  }

  onCopyValueClicked() {
    this.copyValue.emit();
  }
}
