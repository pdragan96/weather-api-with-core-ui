import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  HostListener
} from '@angular/core';

import { EsSelectComponent } from '../es-select/es-select.component';
import { IEsDropdownSelectItem } from '../base/es-dropdown-select';

@Component({
  selector: 'es-dropdown-search',
  templateUrl: './es-dropdown-search.component.html',
  styleUrls: ['./es-dropdown-search.component.scss']
})
export class EsDropdownSearchComponent extends EsSelectComponent implements OnInit {

  @ViewChild('searchField') searchField: any;
  @ViewChild('itemsList') itemsList: any;

  @Input() isReadonly: boolean;
  @Input() placeholderText: string;

  @Input() valueField: string;
  @Input() displayField: string;

  @Output() selectListItem: EventEmitter<IEsDropdownSelectItem>;

  constructor(
    private element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef) {

    super(element, renderer, changeDetectorRef, null, null, null, null, null);

    this.valueField = 'id';
    this.displayField = 'text';

    this.selectListItem = new EventEmitter<IEsDropdownSelectItem>();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onOpenDropdownOnKeyPress(event: KeyboardEvent) {
    if (!this._itemsVisible && !(event.which === 13 || event.keyCode === 13)) {
      this.onToggleDropdown();
    }
  }

  onToggleDropdown(): void {
    if (!this.isReadonly) {
      this.onDropdownSelect();
    }
  }

  // EsSelectComponent override
  getDisplayValue(item: any): string {
    return this.displayWith ? this.displayWith(item) : item[this.displayField] || item[this.valueField]?.toString() || '';
  }

  // EsSelectComponent override
  onItemSelect(item: IEsDropdownSelectItem, index: number): void {
    this.selectListItem.emit(item.id);
    this.items.splice(index, 1);
    this.clearInputField();
    this.onClear();
  }

  clearInputField() {
    this.searchField.inputField.nativeElement.value = '';
  }

  onKeyboardReturnPress(item: IEsDropdownSelectItem, index: number) {
    this.onItemSelect(item, index);
  }

  @HostListener('document:mousedown', ['$event'])
  public onClickOut(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.clearInputField();
    }
  }

}
