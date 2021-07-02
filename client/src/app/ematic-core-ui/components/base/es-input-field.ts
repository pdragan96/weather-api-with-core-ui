import {
  ElementRef,
  Renderer2,
  EventEmitter,
  ChangeDetectorRef,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  Directive
} from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { EsField } from './es-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

export type TextAlignment = 'left' | 'center' | 'right';

@Directive()
export class EsInputField<T> extends EsField<T> implements AfterViewInit {

  @ViewChild('inputField', { static: true }) inputField: ElementRef;

  @Input() autofocus: boolean;
  @Input() textAlignment: TextAlignment;

  @Output() submit: EventEmitter<void>;

  @HostBinding('class.es-align-center')
  public get centerAlignment(): boolean {
    return this.textAlignment === 'center';
  }

  @HostBinding('class.es-align-right')
  public get rightAlignment(): boolean {
    return this.textAlignment === 'right';
  }

  get inputFieldElement(): HTMLInputElement {
    return this.inputField.nativeElement;
  }

  get inputValue(): any {
    return this.inputFieldElement.value;
  }

  set inputValue(value: any) {
    this.inputFieldElement.value = value;
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    esFormFieldset: EsFormFieldsetComponent,
    esFormField?: EsFormFieldComponent,
    parentForm?: NgForm,
    parentFormGroup?: FormGroupDirective,
    control?: NgControl) {

    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.submit = new EventEmitter<void>();

    this.focused = false;
    this.textAlignment = 'left';

    this.autofocus = false;
  }

  @HostBinding('class.es-focus')
  public focused: boolean;

  ngAfterViewInit(): void {
    if (!this.isEsDisabled && !this.isEsReadonly && this.autofocus) {
      setTimeout(() => {
        this.inputFieldElement.focus();
      }, 10);
    }
  }

  onInnerInputFocus() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.focused = true;
    }
  }

  onInnerInputBlur() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.onControlTouched();
    }

    this.focused = false;
  }

  onInnerInputKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13 && !this.isInvalid) {
      this.submit.emit();
    }
  }

  @HostListener('focus')
  onInputFieldFocus() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.inputFieldElement.focus();
    }
  }

  // override from EsField
  onBlur() {
    // do nothing
  }
}
