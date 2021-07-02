import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer2,
  HostListener,
  ChangeDetectorRef,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { IEsMenuItem } from './es-menu-item';
import { EsDropdownField } from '../base/es-dropdown-field';
import { constants } from '../../strings/constants';

export interface IEsMenuListItem extends IEsMenuItem {
  id: any;
  hovered: boolean;
}

@Component({
  selector: 'es-menu',
  templateUrl: './es-menu.component.html',
  styleUrls: ['./es-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsMenuComponent extends EsDropdownField<string> implements OnInit, OnChanges {

  @Input() text: string;
  @Input() iconClass: string;
  @Input() isDisabled: boolean;
  @Input() items: IEsMenuItem[];
  @Input() hasTransparentColors: boolean;
  @Input() hasCustomizedButton: boolean;

  public get isEsReadonly(): boolean {
    return false;
  }

  public get isEsCompact(): boolean {
    return false;
  }

  public get isEsFocusable(): boolean {
    return false;
  }

  public get isEsCursorPointer(): boolean {
    return true;
  }

  public get isEsCursorText(): boolean {
    return false;
  }

  public get isEsInvalid(): boolean {
    return false;
  }

  public get isEsDisabled(): boolean {
    return false;
  }

  public get esTabIndex(): number {
    return -1;
  }

  highlightedItemIndex: number;
  menuListItems: IEsMenuListItem[];

  get btnClass(): string {
    return this.isRounded ? 'btn btn-rounded btn-primary' : 'es-menu';
  }

  get hideText(): boolean {
    return this.iconClass && this.text && window.innerWidth < constants.MEDIA_POINTS.WXGA;
  }

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(element, renderer, changeDetectorRef, null, null, null, null);

    this.items = [];
    this.menuListItems = [];
    this.highlightedItemIndex = 0;
    this.isDisabled = false;
    this.hasTransparentColors = false;
    this.hasCustomizedButton = false;
  }

  setMenuListItems() {
    this.highlightedItemIndex = 0;

    this.menuListItems = this.items.map((a, index) => {
      return <IEsMenuListItem>{
        id: index,
        text: a.text,
        iconClass: a.iconClass,
        hovered: false,
        action: a.action
      };
    });

    this._changeDetectorRef.markForCheck();
  }

  ngOnInit() {
    this.setMenuListItems();
  }

  ngOnChanges() {
    this.setMenuListItems();
  }

  // override from EsField
  onBlur(): void {
  }

  // override from EsDropdownField
  hideItems(): void {
    this.setMenuListItems();
    super.hideItems();
  }

  showItems(): void {
    this.setMenuListItems();
    super.showItems();
  }


  @HostListener('document:keydown', ['$event'])
  public onDocumentKeydownDropdownSelect(event: KeyboardEvent): void {
    if (this._itemsVisible) {
      let newIndex: number;

      switch (event.which || event.keyCode) {
        case 38: // arrowup
          newIndex = this.highlightedItemIndex - 1;
          this.highlightItem(newIndex < 0 ? 0 : newIndex, true);

          event.preventDefault();
          break;
        case 40: // arrowdown
          newIndex = this.highlightedItemIndex + 1;
          this.highlightItem(newIndex > this.menuListItems.length - 1 ? this.menuListItems.length - 1 : newIndex, true);

          event.preventDefault();
          break;
        case 13: // return
          const highlightedItem = this.menuListItems[this.highlightedItemIndex];
          if (highlightedItem) {
            this.executeAction(highlightedItem.action);
          }

          event.preventDefault();
          break;
      }
    }
  }

  public itemsTrackBy(index: number, item: IEsMenuListItem) {
    return item.id;
  }

  public highlightItem(newIndex: number, highlight: boolean): void {
    const highlightedItem = this.menuListItems[this.highlightedItemIndex];
    if (highlightedItem) {
      highlightedItem.hovered = false;
    }

    if (this.menuListItems.length > 0) {
      this.menuListItems[this.highlightedItemIndex = newIndex].hovered = highlight;
    }
  }

  public onItemMouseEnter(event: MouseEvent, index: number) {
    this.highlightItem(index, true);
  }

  executeAction(action?: () => void): void {
    if (action) {
      action();
      this.hideItems();
    }
  }
}
