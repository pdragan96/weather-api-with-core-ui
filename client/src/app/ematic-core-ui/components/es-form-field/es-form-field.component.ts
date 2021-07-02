import { Component, OnInit, Input, HostBinding, EventEmitter, ChangeDetectionStrategy, Optional, OnChanges } from '@angular/core';

import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

export type EsLabelPosition = 'top' | 'left' | 'right';

@Component({
  selector: 'es-form-field',
  templateUrl: './es-form-field.component.html',
  styleUrls: ['./es-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsFormFieldComponent implements OnInit, OnChanges {
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() labelText?: string;
  @Input() labelPosition: EsLabelPosition;
  @Input() labelWidth: number;

  public onChanges: EventEmitter<boolean>;

  private esFormFieldset: EsFormFieldsetComponent;

  get labelClass(): EsLabelPosition {
    return this.labelPosition || 'top';
  }

  get topLeftPosition(): boolean {
    return this.labelText && (this.labelPosition !== 'right');
  }

  get rightPosition(): boolean {
    return this.labelText && (this.labelPosition === 'right');
  }

  get labelWidthString() {
    return this.labelPosition !== 'top' ? `${ this.labelWidth }px` : 'auto';
  }

  @HostBinding('class.es-disabled')
  get isEsDisabled(): boolean {
    const esFormFieldsetDisabled = this.esFormFieldset && this.esFormFieldset.disabled;
    return !!(this.disabled || esFormFieldsetDisabled);
  }

  get isEsReadonly(): boolean {
    const esFormFieldsetReadonly = this.esFormFieldset && this.esFormFieldset.readonly;
    return !!(this.readonly || esFormFieldsetReadonly);
  }

  constructor(@Optional() esFormFieldset: EsFormFieldsetComponent) {
    this.esFormFieldset = esFormFieldset;

    this.labelText = null;
    this.labelPosition = 'top';
    this.labelWidth = 150;
    this.disabled = false;
    this.readonly = false;

    this.onChanges = new EventEmitter<boolean>();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.esFormFieldset) {
      this.onChanges.emit(false);
    }
  }

  onLabelClick() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.onChanges.emit(true);
    }
  }
}
