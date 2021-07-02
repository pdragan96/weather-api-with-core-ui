import { Component, OnInit, ElementRef, Renderer2, Optional, Self, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { EsInputField } from '../base/es-input-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';
import { CommonUtil } from '../../util/common-util';

@Component({
  selector: 'es-text-field',
  templateUrl: './es-text-field.component.html',
  styleUrls: ['./es-text-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsTextFieldComponent extends EsInputField<string> implements OnInit {

  @Input() type: string;
  @Input() copyable: boolean;

  public get showCopyIcon(): boolean {
    return this.copyable && this.innerValue != null;
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() esFormFieldset: EsFormFieldsetComponent,
    @Optional() esFormField: EsFormFieldComponent,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Self() @Optional() control: NgControl
  ) {
    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.copyable = false;
  }

  ngOnInit() {
    if (!this.type) {
      this.type = 'text';
    }
  }

  // override from EsControlValueAccessor
  writeValue(value: string): void {
    // trim white space
    if (value && typeof value === 'string') {
      value = value.trim();
    }

    super.writeValue(value);
  }

  // override from EsInputField
  onInnerInputBlur() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.onControlTouched();
    }

    // trim whitespace
    if (this.inputValue) {
      this.innerValue = this.innerValue.trim();
    }

    this.focused = false;
  }

  public onCopyValue() {
    CommonUtil.copyToClipboard(this.innerValue ? this.innerValue : '');
  }
}
