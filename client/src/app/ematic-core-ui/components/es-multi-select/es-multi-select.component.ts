import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  Optional,
  Self,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { CommonUtil } from '../../util/common-util';

import { EsDropdownSelect, IEsDropdownSelectItem } from '../base/es-dropdown-select';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-multi-select',
  templateUrl: './es-multi-select.component.html',
  styleUrls: ['./es-multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsMultiSelectComponent extends EsDropdownSelect<any[]> implements OnInit {
  @ViewChild('searchField') searchField: ElementRef;
  @ViewChild('itemsList') itemsList: ElementRef;

  @Input() valueField: string;
  @Input() displayField: string;
  @Input() applyText: string;
  @Input() displayMultipleItems: boolean;

  checkedItems: IEsDropdownSelectItem[];
  checkedItemsDict: any;

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

    this.valueField = 'id';
    this.displayField = 'text';

    this.applyText = 'Apply';

    this.checkedItems = [];
    this.checkedItemsDict = {};
    this.displayMultipleItems = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // override from EsDropdownField
  public getDisplayText(): string {
    if (this.innerValue && Array.isArray(this.innerValue)) {
      switch (this.innerValue.length) {
        case 0:
          return this.placeholder;
        case 1:
          return this.displayWith
            ? this.displayWith(this.innerValue[0])
            : this.innerValue[0][this.displayField] || this.innerValue[0][this.valueField]?.toString();
        default:
          if (this.displayMultipleItems) {
            const values: string[] = [];
            this.innerValue.forEach(value => {
              values.push(value[this.displayField]);
            });
            return values.join(', ');
          } else {
            return 'Multiple items selected';
          }
      }
    }

    return this.placeholder;
  }

  getDisplayValue(item: any): string {
    return this.displayWith ? this.displayWith(item) : item[this.displayField] || item[this.valueField]?.toString() || '';
  }

  // override from EsControlValueAccessor
  writeValue(value: any): void {
    this._innerValue = value;

    this.setCheckedItems();

    this._changeDetectorRef.markForCheck();
  }

  setCheckedItems() {
    if (this.innerValue && this.innerValue.length) {
      this.checkedItems = this.innerValue.map(a => {
        return <IEsDropdownSelectItem>{
          id: a[this.valueField],
          text: this.getDisplayValue(a),
          hovered: false,
          checked: true
        };
      });

      this.checkedItemsDict = CommonUtil.toDictionary(this.checkedItems, 'id');
    } else {
      this.checkedItems = [];
      this.checkedItemsDict = {};
    }
  }

  mapItem(item: any): any {
    return Object.assign({}, item);
  }

  clear(): void {
    this._items = [];
    this.items = [];
    this.checkedItems = [];

    this.setCheckedItems();

    this.highlightedItemIndex = 0;
  }

  transformItems(): void {
    this.items = this._items.map(a => {
      return <IEsDropdownSelectItem>{
        id: a[this.valueField],
        text: this.getDisplayValue(a),
        hovered: false,
        checked: !!this.checkedItemsDict[a[this.valueField]]
      };
    });
  }

  onFilter(query?: string) {
    this.transformItems(); // Restore old items
    const filtered = this.items.filter(a => {
      return a.checked || a.text.toLowerCase().lastIndexOf((query || '').toLowerCase()) !== -1;
    });

    const checked = filtered.filter(a => a.checked);
    const unChecked = filtered.filter(a => !a.checked);

    this.items = query ? unChecked.concat(checked) : checked.concat(unChecked);
  }

  scrollToItem(index: number): void {
    // do nothing
  }

  onKeyboardReturnPress(item: IEsDropdownSelectItem, index: number) {
    this.toggleChecked(true, item);
  }

  toggleChecked(checked: boolean, item: IEsDropdownSelectItem) {
    if (checked && !this.checkedItems.find(a => a.id === item.id)) {
      item.checked = true;
      this.checkedItems.push(Object.assign({}, item));
    } else {
      this.checkedItems = this.checkedItems.filter(a => a.id !== item.id);
    }

    this.checkedItemsDict = CommonUtil.toDictionary(this.checkedItems, 'id');
  }

  onApply(): void {
    const filtered = this._items.filter(a => this.checkedItemsDict[a[this.valueField]]);
    this.innerValue = filtered.length > 0 ? filtered : null;
    this.hideItems();
  }
}
