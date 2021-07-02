import {
  Component,
  OnInit,
  Input,
  Optional,
  Self,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { IEsGroupedListItem } from '../es-grouped-list/es-grouped-list-item';
import { EsDropdownField } from '../base/es-dropdown-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-grouped-list-picker',
  templateUrl: './es-grouped-list-picker.component.html',
  styleUrls: ['./es-grouped-list-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsGroupedListPickerComponent extends EsDropdownField<IEsGroupedListItem> implements OnInit, OnDestroy {
  @Input() rootGroupName: string;

  @Input() displayWith?: (item?: IEsGroupedListItem) => string;

  @Input() onQuery: () => Observable<IEsGroupedListItem[]>;

  items: IEsGroupedListItem[];
  isLoading: boolean;
  closable: boolean;
  subscription: Subscription;

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() esFormFieldset: EsFormFieldsetComponent,
    @Optional() esFormField: EsFormFieldComponent,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Self() @Optional() control: NgControl) {

    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.isLoading = true;
    this.subscription = null;

    this.items = [];

    this.closable = false;
  }

  ngOnInit() {
  }

  // override from EsDropdownField
  getDisplayText(): string {
    return this.displayWith
      ? this.displayWith(this.innerValue)
      : this.innerValue.text || this.innerValue.id?.toString();
  }

  getDisplayValue(item: IEsGroupedListItem): string {
    return this.displayWith ? this.displayWith(item) : item.text || item.id?.toString() || '';
  }

  unsubscribe() {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }

  doQuery(): void {
    this.isLoading = true;
    this.clear();

    this.subscription = this.onQuery().subscribe({
      next: items => {
        this.isLoading = false;
        this.items = items.map(item => {
          const newItem = Object.assign({}, item);
          newItem.text = this.getDisplayValue(newItem);
          return newItem;
        });

        this._changeDetectorRef.markForCheck();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  public clear(): void {
    this.items = [];
  }

  // override from EsDropdownField
  public onDropdownSelect(): void {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      if (!this._clearClicked) {
        this.clear();
        this.toggleItems();

        if (this._itemsVisible) {
          this.doQuery();
        }
      } else {
        this._clearClicked = false;
      }
    }
  }

  // override from EsField
  public onClear() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.innerValue = null;
      this._clearClicked = true;
      this.clear();
      this.hideItems();
    }
  }

  // override from EsDropdownField
  public hideItems() {
    this.unsubscribe();
    super.hideItems();
  }

  onGroupSelect(group: IEsGroupedListItem) {
    this.closable = false;
  }

  onAnimationEnd() {
    this.closable = true;
  }

  onItemSelect(item: IEsGroupedListItem) {
    this.innerValue = item;
    this.clear();
    this.hideItems();
  }

  // override from Field
  ngOnDestroy() {
    super.ngOnDestroy();
    this.unsubscribe();
  }
}
