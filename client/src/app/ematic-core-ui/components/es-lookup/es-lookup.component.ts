import { maxBy } from 'lodash-es';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewChild
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';

import { EsDropdownSelect, IEsDropdownSelectItem } from '../base/es-dropdown-select';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-lookup',
  templateUrl: './es-lookup.component.html',
  styleUrls: ['./es-lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsLookupComponent extends EsDropdownSelect<any> implements OnInit {
  @ViewChild('searchField') searchField: ElementRef;
  @ViewChild('itemsList') itemsList: ElementRef;

  @Input() valueField: string;
  @Input() displayField: string;
  @Input() shrinkDropdown: boolean;

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
    this.shrinkDropdown = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // override from EsDropdownField
  public getDisplayText(): string {
    return this.displayWith
      ? this.displayWith(this.innerValue)
      : this.innerValue[this.displayField] || this.innerValue[this.valueField]?.toString();
  }

  getDisplayValue(item: any): string {
    return this.displayWith ? this.displayWith(item) : item[this.displayField] || item[this.valueField]?.toString() || '';
  }

  mapItem(item: any): any {
    return Object.assign({}, item);
  }

  public transformItems(): void {
    this.items = this._items.map(a => {
      return <IEsDropdownSelectItem>{
        id: a[this.valueField],
        text: this.getDisplayValue(a),
        hovered: false,
        selected: this.innerValue ? this.innerValue[this.valueField] === a[this.valueField] : false
      };
    });
  }

  onFilter(query?: string) {
    this.transformItems(); // Restore old items
    this.items = this.items.filter(a => {
      return a.text.toLowerCase().lastIndexOf((query || '').toLowerCase()) !== -1;
    });
  }

  onKeyboardReturnPress(item: IEsDropdownSelectItem, index: number) {
    this.onItemSelect(item, index);
  }

  onItemSelect(item: IEsDropdownSelectItem, index: number): void {
    this.innerValue = this._items.find(a => a[this.valueField] === item.id);
    this.items.forEach((innerItem, innerIndex) => {
      innerItem.selected = index === innerIndex;
    });
    this.hideItems();
  }

  public getListItemShrunkStyle() {
    const maxItem = maxBy(this.items, (item) => item.text.length);
    return !this._isMobile && this.shrinkDropdown && maxItem ? { width: maxItem.text.length + 1 + 'ch' } : {};
  }
}
