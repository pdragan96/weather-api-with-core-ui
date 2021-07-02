import { ElementRef, Renderer2, EventEmitter, Input, Output, HostListener, ChangeDetectorRef, Directive } from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { EsField } from './es-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';
import { constants } from '../../strings/constants';
import { DropdownAlignment } from '../../directives/es-dropdown/es-dropdown.directive';

@Directive()
export class EsDropdownField<T> extends EsField<T> {
  @Input()
  public dropdownAlignment: DropdownAlignment;
  @Input()
  public hasTransparentColors: boolean;
  @Input()
  public pointerBottom: boolean;
  @Input()
  public disableTopDropdownAlignment: boolean;

  @Output()
  public selected?: EventEmitter<T>;

  public _itemsVisible: boolean;
  public _itemsContainer: ElementRef;
  public _mobileBreakpoint: number;
  public _isMobile: boolean;

  public get documentWidth(): number {
    return window.innerWidth;
  }

  // override from Field
  public get isEsInvalid(): boolean {
    return !this._itemsVisible && this.isInvalid;
  }

  public get showErrorMessage() {
    return !this._itemsVisible && this.errorMessageVisible;
  }

  public get displayText(): string {
    if (typeof this.innerValue !== 'undefined' && this.innerValue !== null) {
      return this.getDisplayText();
    }

    return this.placeholder;
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    esFormFieldset: EsFormFieldsetComponent,
    esFormField?: EsFormFieldComponent,
    parentForm?: NgForm,
    parentFormGroup?: FormGroupDirective,
    control?: NgControl
  ) {
    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.selected = new EventEmitter<T>();
    this.doValueChange = () => {
      this.selected.emit(this.innerValue);
    };

    this.isDropdown = true;
    this.dropdownAlignment = 'left';
    this.hasTransparentColors = false;
    this.pointerBottom = false;
    this.disableTopDropdownAlignment = false;

    this._itemsVisible = false;
    this._itemsContainer = element;
    this._mobileBreakpoint = constants.MEDIA_POINTS.MOBILE_BREAKPOINT;

    this._isMobile = this.documentWidth <= this._mobileBreakpoint;
  }

  onBlur() {
    if (!this._itemsVisible) {
      super.onBlur();
    }
  }

  public getDisplayText(): string {
    throw new Error('getDisplayText: Not Implemented');
  }

  public enableScrolling(force = false) {
    if (this._isMobile || force) {
      this._renderer.setStyle(document.body, 'overflow', 'visible');
    }
  }

  public disableScrolling(force = false) {
    if (this._isMobile || force) {
      this._renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  public toggleItems(): void {
    this._isMobile = this.documentWidth <= this._mobileBreakpoint;
    this._itemsVisible ? this.hideItems() : this.showItems();
  }

  public showItems(): void {
    this._itemsVisible = true;
    this.disableScrolling();
  }

  public hideItems(): void {
    super.onBlur();
    this._itemsVisible = false;
    this.enableScrolling();
  }

  public onItemsHidden(): void {
    this.hideItems();
  }

  // override from Field
  public onClear() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.innerValue = null;
      this._clearClicked = true;
      this.hideItems();
    }
  }

  public onDropdownSelect(): void {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      if (!this._clearClicked) {
        this.toggleItems();
      } else {
        this._clearClicked = false;
      }
    }
  }

  public onDropdownClose(): void {
    this.hideItems();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResizeDropdownField(event: Event): void {
    this._isMobile = this.documentWidth <= this._mobileBreakpoint;
    if (this._itemsVisible && this._isMobile) {
      this.disableScrolling(true);
    } else if (this._itemsVisible && !this._isMobile) {
      this.enableScrolling(true);
    }
  }

  onPointerBottom(isBottom: boolean) {
    this.pointerBottom = isBottom;
  }
}
