import { ChangeDetectorRef, ElementRef, HostBinding, HostListener, Input, OnDestroy, Renderer2, Directive } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { EsControlValueAccessor } from './es-control-value-accessor';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Directive()
export class EsField<T> extends EsControlValueAccessor<T> implements OnDestroy {
  @Input()
  public name: string;

  @Input()
  public placeholder: string;

  @Input()
  public readonly: boolean;

  @Input()
  public clearable: boolean;

  @Input()
  public compact: boolean;

  @Input()
  public tabIndex: number;

  @Input()
  public autocomplete: string;

  @Input()
  public isRounded: boolean;

  public isDropdown: boolean;

  public _element: ElementRef;
  public _renderer: Renderer2;
  public _esFormFieldsetSubscription: Subscription;
  public _esFormFieldSubscription: Subscription;

  public _clearClicked: boolean;

  @HostBinding('class.es-readonly')
  public get isEsReadonly(): boolean {
    const esFormFieldsetReadonly = this._esFormFieldset && this._esFormFieldset.readonly;
    const esFormFieldReadonly = this._esFormField && this._esFormField.readonly;

    return !!(this.readonly || esFormFieldsetReadonly || esFormFieldReadonly);
  }

  @HostBinding('class.es-compact')
  public get isEsCompact(): boolean {
    return this.compact;
  }

  @HostBinding('class.es-focusable')
  public get isEsFocusable(): boolean {
    return !this.isEsDisabled;
  }

  @HostBinding('class.es-cursor-pointer')
  public get isEsCursorPointer(): boolean {
    return !this.isEsDisabled && this.isDropdown;
  }

  @HostBinding('class.es-cursor-text')
  public get isEsCursorText(): boolean {
    return !this.isEsDisabled && !this.isDropdown;
  }

  @HostBinding('class.es-invalid')
  public get isEsInvalid(): boolean {
    return this.isInvalid;
  }

  @HostBinding('attr.tabindex')
  public get esTabIndex(): number {
    return this.isEsDisabled || this.isEsReadonly ? -1 : this.tabIndex;
  }

  public get isInvalid(): boolean {
    return !this.compact && !this.isEsDisabled && !this.isEsReadonly && this.invalid;
  }

  public get errorMessageVisible(): boolean {
    return this.errorMessage && this.isInvalid;
  }

  public get showErrorMessage(): boolean {
    return this.errorMessageVisible;
  }

  public get showDropdownIcon(): boolean {
    return this.clearable ? !this.innerValue && !this.isEsReadonly : !this.isEsReadonly;
  }

  public get showClearIcon(): boolean {
    return this.clearable && this.innerValue && !this.isEsReadonly && !this.isEsDisabled;
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    esFormFieldset?: EsFormFieldsetComponent,
    esFormField?: EsFormFieldComponent,
    parentForm?: NgForm,
    parentFormGroup?: FormGroupDirective,
    control?: NgControl) {

    super(changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this._element = element;
    this._renderer = renderer;

    this.name = `es-field-${Math.floor(Math.random() * 1000000000)}`;
    this.tabIndex = 0;

    this.placeholder = '';
    this.autocomplete = '';

    this.readonly = false;
    this.disabled = false;

    this.clearable = true;
    this._clearClicked = false;

    this.compact = false;

    this.isDropdown = false;

    this.isRounded = false;

    this._esFormFieldSubscription = null;

    if (this._esFormField) {
      this._esFormFieldSubscription = this._esFormField.onChanges.subscribe((labelClick: boolean) => {
        this._changeDetectorRef.markForCheck();

        if (labelClick) {
          this._element.nativeElement.focus();
        }
      });
    }

    if (this._esFormFieldset) {
      this._esFormFieldsetSubscription = this._esFormFieldset.onChanges.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  @HostListener('blur')
  public onBlur(): void {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.onControlTouched();
    }
  }

  public touchControl() {
    if (!this.isEsReadonly) {
      super.touchControl();
    }
  }

  public onClear() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.innerValue = null;
      this._clearClicked = true;
    }
  }

  public removeSubscriptions() {
    if (this._esFormFieldSubscription) {
      this._esFormFieldSubscription.unsubscribe();
    }

    if (this._esFormFieldsetSubscription) {
      this._esFormFieldsetSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.removeSubscriptions();
  }
}
