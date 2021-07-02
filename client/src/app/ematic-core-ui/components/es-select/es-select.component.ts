import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  Optional,
  Self,
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { EsDropdownSelect, IEsDropdownSelectItem } from '../base/es-dropdown-select';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-select',
  templateUrl: './es-select.component.html',
  styleUrls: ['./es-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsSelectComponent extends EsDropdownSelect<string | number> implements OnInit {
  @ViewChild('searchField') searchField: ElementRef;
  @ViewChild('itemsList') itemsList: ElementRef;

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
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // override from EsDropdownField
  public getDisplayText(): string {
    return this.displayWith ? this.displayWith(this.innerValue) : this.innerValue?.toString();
  }

  getDisplayValue(item: any): string {
    return this.displayWith ? this.displayWith(item) : item || '';
  }

  mapItem(item: string): string {
    return item;
  }

  transformItems(): void {
    this.items = this._items.map(a => {
      return <IEsDropdownSelectItem>{
        id: a,
        text: this.getDisplayValue(a),
        hovered: false,
        selected: this.innerValue ? this.innerValue === a : false
      };
    });
  }

  onFilter(query?: string) {
    this.transformItems(); // Restore old items
    this.items = this.items.filter(a => {
      return a.text.toLowerCase().lastIndexOf((query || '').toLowerCase()) !== -1;
    });
    this.highlightItem(0, true);
  }

  onKeyboardReturnPress(item: IEsDropdownSelectItem, index: number) {
    this.onItemSelect(item, index);
  }

  onItemSelect(item: IEsDropdownSelectItem, index: number): void {
    this.innerValue = this._items.find(a => a === item.id);
    this.items.forEach((innerItem, innerIndex) => {
      innerItem.selected = index === innerIndex;
    });
    this.hideItems();
  }
}
