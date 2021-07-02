import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'es-dropdown-field',
  templateUrl: './es-dropdown-field.component.html',
  styleUrls: ['./es-dropdown-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsDropdownFieldComponent implements OnInit {
  @ViewChild('container', { static: true }) validationContainer: ElementRef;
  @Input() displayText: string;

  @Input() showErrorMessage: boolean;
  @Input() errorMessage: string;

  @Input() showDropdownIcon: boolean;
  @Input() showClearIcon: boolean;

  @Input() compact: boolean;
  @Input() isRounded: boolean;
  @Input() hasTransparentColors: boolean;

  @Output() clicked: EventEmitter<void>;
  @Output() cleared: EventEmitter<void>;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
    this.displayText = null;

    this.showErrorMessage = false;
    this.errorMessage = null;

    this.showClearIcon = true;
    this.showDropdownIcon = true;

    this.compact = false;
    this.isRounded = false;
    this.hasTransparentColors = false;

    this.clicked = new EventEmitter<void>();
    this.cleared = new EventEmitter<void>();
  }

  ngOnInit() {
  }

  onDropdownClicked() {
    this.clicked.emit();
  }

  onClearClicked() {
    this.cleared.emit();
  }
}
