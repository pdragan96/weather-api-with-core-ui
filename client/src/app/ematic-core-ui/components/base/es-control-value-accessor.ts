import { ChangeDetectorRef, Input, HostBinding, Directive } from '@angular/core';
import { NgForm, FormGroupDirective, NgControl, ControlValueAccessor } from '@angular/forms';

import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Directive()
export class EsControlValueAccessor<T> implements ControlValueAccessor {
  @Input()
  public disabled: boolean;

  @Input()
  public errorMessage: string;

  public _changeDetectorRef: ChangeDetectorRef;
  public _esFormFieldset: EsFormFieldsetComponent;
  public _esFormField: EsFormFieldComponent;
  public _parentForm: NgForm;
  public _parentFormGroup: FormGroupDirective;
  public _control: NgControl;

  public _innerValue: T;

  public onValueChange: (value: any) => void;
  public onControlTouched: () => void;
  public doValueChange?: () => void;

  // override in child class if you have custom validation on your component
  public validateControl?: () => boolean;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    esFormFieldset?: EsFormFieldsetComponent,
    esFormField?: EsFormFieldComponent,
    parentForm?: NgForm,
    parentFormGroup?: FormGroupDirective,
    control?: NgControl) {

    this._changeDetectorRef = changeDetectorRef;
    this._esFormFieldset = esFormFieldset;
    this._esFormField = esFormField;
    this._parentForm = parentForm;
    this._parentFormGroup = parentFormGroup;
    this._control = control;

    if (this._control) {
      this._control.valueAccessor = this;
    }

    // noinspection JSUnusedLocalSymbols
    this.onValueChange = (value: any) => {
    };
    this.onControlTouched = () => {
    };

    this.disabled = false;
    this.errorMessage = null;
  }

  public get innerValue(): T {
    return this._innerValue;
  }

  public set innerValue(value: T) {
    this._innerValue = value;

    this.touchControl();

    this.onValueChange(this._innerValue);
    if (this.doValueChange) {
      this.doValueChange();
    }
  }

  @HostBinding('class.es-disabled')
  public get isEsDisabled(): boolean {
    const esFormFieldsetDisabled = this._esFormFieldset && this._esFormFieldset.disabled;
    const esFormFieldDisabled = this._esFormField && this._esFormField.disabled;

    return !!(this.disabled || esFormFieldDisabled || esFormFieldsetDisabled);
  }

  public get invalid(): boolean {
    const isInvalid = this._control && this._control.invalid;
    const isTouched = this._control && this._control.touched;
    const isSubmitted = this._parentFormGroup && this._parentFormGroup.submitted || this._parentForm && this._parentForm.submitted;

    if (this.validateControl && !this.validateControl()) {
      return true;
    }

    return !!(isInvalid && (isTouched || isSubmitted));
  }

  public get touched(): boolean {
    return this._control && this._control.touched;
  }

  public writeValue(value: T): void {
    this._innerValue = value;

    this._changeDetectorRef.markForCheck();
  }


  public registerOnChange(fn: (value: any) => void): void {
    this.onValueChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onControlTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  public touchControl() {
    if (!this.touched && !this.isEsDisabled) {
      this.onControlTouched();
    }
  }
}
