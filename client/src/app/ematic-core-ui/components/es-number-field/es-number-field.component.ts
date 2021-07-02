import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  Optional,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  Injector
} from '@angular/core';
import {
  NgForm,
  FormGroupDirective,
  NgControl,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';

import { EsInputField } from '../base/es-input-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

import { CommonUtil } from '../../util/common-util';

@Component({
  selector: 'es-number-field',
  templateUrl: './es-number-field.component.html',
  styleUrls: ['./es-number-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EsNumberFieldComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EsNumberFieldComponent),
    multi: true
  }]
})
export class EsNumberFieldComponent extends EsInputField<number> implements OnInit, Validator {

  @Input() commaAsDecimalSeparator: boolean;
  @Input() decimalPlaces: number;
  @Input() minValue?: number;
  @Input() maxValue?: number;
  @Input() inRange: boolean;
  @Input() formatDecimalsWhenNumberIsWhole: boolean;

  get decimalSeparator(): string {
    return this.commaAsDecimalSeparator ? ',' : '.';
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() esFormFieldset: EsFormFieldsetComponent,
    @Optional() esFormField: EsFormFieldComponent,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    private injector: Injector) {

    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup);

    this.decimalPlaces = 0;
    this.minValue = null;
    this.maxValue = null;
    this.inRange = false;
    this.formatDecimalsWhenNumberIsWhole = false;

    this.validateControl = this.doValidateControl;
  }

  ngOnInit() {
    this._control = this.injector.get<NgControl>(NgControl, null);

    if (this._control) {
      this._control.valueAccessor = this;
    }
  }

  // override from EsControlValueAccessor
  writeValue(value: number): void {
    this._innerValue = this.getInnerValue(value);

    this.inputValue = CommonUtil.formatNumber(value, this.decimalPlaces, this.decimalSeparator, this.formatDecimalsWhenNumberIsWhole);

    this._changeDetectorRef.markForCheck();
  }

  // override from EsInputField
  onInnerInputFocus() {
    super.onInnerInputFocus();

    this.inputFieldElement.type = 'number';
    this.inputValue = this.innerValue;
  }

  // override from EsInputField
  onInnerInputBlur() {
    super.onInnerInputBlur();

    this.inputFieldElement.type = 'text';
    const value = this.innerValue;
    this.inputValue = CommonUtil.formatNumber(value, this.decimalPlaces, this.decimalSeparator, this.formatDecimalsWhenNumberIsWhole);
  }

  doValidateControl(): boolean {
    if (!this.inRange && this.minValue && this.minValue > this.innerValue) {
      return false;
    }

    return !(!this.inRange && this.maxValue && this.maxValue < this.innerValue);
  }

  onInnerInputChange() {
    const innerInputValue = this.inputValue;
    if (!isNaN(innerInputValue) && innerInputValue !== '') {
      this.innerValue = this.getInnerValue(parseFloat(innerInputValue));
    }
    if (innerInputValue === '') {
      this.innerValue = null;
    }
  }

  getInnerValue(value: number): number {
    if (!value) {
      return value;
    }

    if (this.inRange) {
      if (!this.minValue) {
        this.minValue = 0;
      }

      if (!this.maxValue) {
        this.maxValue = CommonUtil.maxSafeNumber;
      }

      if (value < this.minValue) {
        return this.minValue;
      } else if (value > this.maxValue) {
        return this.maxValue;
      } else {
        return value;
      }
    } else {
      return value;
    }
  }

  public onClear() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.innerValue = null;
      this._clearClicked = true;

      this.inputValue = null;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const isMinValid = this.minValidator();
    const isMaxValid = this.maxValidator();

    if (isMinValid !== null) {
      return isMinValid;
    }

    if (isMaxValid !== null) {
      return isMaxValid;
    }

    return null;
  }

  private minValidator(): any {
    const minErr: any = {
      minError: {
        minValue: this.minValue,
        value: this._control.value
      }
    };

    return this._control.value !== null && this.minValue && this._control.value < this.minValue ? minErr : null;
  }

  private maxValidator(): any {
    const maxErr: any = {
      maxError: {
        maxValue: this.maxValue,
        value: this._control.value
      }
    };

    return this._control.value !== null && this.maxValue && this._control.value > this.maxValue ? maxErr : null;
  }
}
