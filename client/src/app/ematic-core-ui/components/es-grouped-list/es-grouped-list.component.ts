import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  HostListener,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { IEsGroupedListItem } from './es-grouped-list-item';
import { list, group } from './es-grouped-list-animations';

@Component({
  selector: 'es-grouped-list',
  templateUrl: './es-grouped-list.component.html',
  styleUrls: ['./es-grouped-list.component.scss'],
  animations: [
    group,
    list
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsGroupedListComponent implements OnInit, OnChanges {
  @ViewChild('itemsList', { static: true }) itemsList: ElementRef;

  @Input() rootGroupName: string;
  @Input() item: IEsGroupedListItem;
  @Input() items: IEsGroupedListItem[];

  @Output() groupSelect: EventEmitter<IEsGroupedListItem>;
  @Output() animationEnd: EventEmitter<void>;
  @Output() selected: EventEmitter<IEsGroupedListItem>;

  groups: IEsGroupedListItem[];
  listItems: IEsGroupedListItem[];
  rootGroup: IEsGroupedListItem;

  highlightedItemIndex: number;

  animationTrigger: string;

  get listLeftPosition(): string {
    return `${ (this.groups.length + 1) * 50 }px`;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef) {

    this.item = null;
    this.items = [];
    this.highlightedItemIndex = 0;

    this.rootGroupName = 'Root';
    this.groups = [];
    this.rootGroup = <IEsGroupedListItem>{
      id: 'root',
      parentId: null,
      text: this.rootGroupName
    };

    this.animationTrigger = 'reset';

    this.groupSelect = new EventEmitter<IEsGroupedListItem>();
    this.animationEnd = new EventEmitter<void>();
    this.selected = new EventEmitter<IEsGroupedListItem>();
  }

  setGroupedListItems() {
    if (this.item) {
      this.groups = this.findGroups(this.item);
      this.listItems = this.filterGroupedListItems(a => a.parentId === this.item.parentId);
    } else {
      this.groups = [];
      this.listItems = this.filterGroupedListItems(a => a.parentId === null);
    }

    this.rootGroup.text = this.rootGroupName;

    this.changeDetectorRef.markForCheck();
  }

  filterGroupedListItems(filterFn: (value: IEsGroupedListItem) => boolean): IEsGroupedListItem[] {
    return this.items.filter(filterFn).map((item, index) => {
      const newItem = Object.assign(<IEsGroupedListItem>{}, item);
      if (this.item && this.item.id === newItem.id) {
        newItem.selected = true;
        this.highlightedItemIndex = index;
      }

      return newItem;
    });
  }

  ngOnInit() {
    this.setGroupedListItems();
  }

  ngOnChanges() {
    this.setGroupedListItems();

    this.slide();
  }

  @HostListener('document:keydown', ['$event'])
  public onGroupedListKeyDown(event: KeyboardEvent): void {
    if (this.listItems.length > 0) {
      let newIndex: number;

      switch (event.which || event.keyCode) {
        case 37: // arrowleft
          this.onBack();
          event.preventDefault();
          break;
        case 38: // arrowup
          newIndex = this.highlightedItemIndex - 1;
          this.highlightItem(newIndex < 0 ? 0 : newIndex, true);

          event.preventDefault();
          break;
        case 40: // arrowdown
          newIndex = this.highlightedItemIndex + 1;
          this.highlightItem(newIndex > this.listItems.length - 1 ? this.listItems.length - 1 : newIndex, true);

          event.preventDefault();
          break;
        case 13: // return
          const highlightedItem = this.listItems[this.highlightedItemIndex];
          if (highlightedItem) {
            this.onItemClick(highlightedItem);
          }

          event.preventDefault();
          break;
      }
    }
  }

  resetAnimation() {
    this.animationTrigger = 'reset';
    this.animationEnd.emit();
  }

  slide(out?: boolean) {
    this.animationTrigger = out ? 'out' : 'in';
    this.changeDetectorRef.markForCheck();
  }

  onAnimationStart() {
    this.scrollToItem(this.highlightedItemIndex);
  }

  itemsTrackBy(index: number, item: IEsGroupedListItem) {
    return item.id;
  }

  highlightItem(newIndex: number, highlight: boolean, scroll = true): void {
    const higlightedItem = this.listItems[this.highlightedItemIndex];
    if (higlightedItem) {
      higlightedItem.hovered = false;
    }

    if (this.listItems.length > 0) {
      this.listItems[this.highlightedItemIndex = newIndex].hovered = highlight;
      if (scroll) {
        this.scrollToItem(this.highlightedItemIndex);
      }
    }
  }

  scrollToItem(index: number): void {
    const li = this.itemsList.nativeElement.querySelector('li');
    if (li) {
      const liRect = li.getBoundingClientRect();
      this.itemsList.nativeElement.scrollTop = index * liRect.height;
    }
  }

  onItemMouseEnter(event: MouseEvent, index: number) {
    this.highlightItem(index, true, false);
  }

  groupLeftPosition(index: number): string {
    return `${ (index + 1) * 50 }px`;
  }

  onRootGroupClick() {
    this.groups = [];
    this.listItems = this.filterGroupedListItems(a => a.parentId === null);

    this.slide(true);

    this.groupSelect.emit(this.rootGroup);
  }

  onGroupClick(item: IEsGroupedListItem, index: number) {
    if (index !== this.groups.length - 1) {
      this.groups = this.groups.slice(0, index + 1);
      const g = this.groups[this.groups.length - 1];
      this.listItems = this.filterGroupedListItems(a => a.parentId === g.id);

      this.slide(true);

      this.groupSelect.emit(item);
    }
  }

  onItemClick(item: IEsGroupedListItem) {
    if (this.isGroup(item)) {
      this.groups.push(item);
      this.listItems = this.filterGroupedListItems(a => a.parentId === item.id);
      this.slide();

      this.groupSelect.emit(item);
    } else {
      this.selected.emit(item);
    }
  }

  onBack() {
    let g = Object.assign({}, this.groups[this.groups.length - 1]);
    this.groups = this.groups.slice(0, this.groups.length - 1);

    if (this.groups.length > 0) {
      g = this.groups[this.groups.length - 1];
      this.listItems = this.filterGroupedListItems(a => a.parentId === g.id);
    } else {
      this.listItems = this.filterGroupedListItems(a => a.parentId === null);
    }

    this.slide(true);
  }

  isGroup(item: IEsGroupedListItem) {
    return this.items.filter(a => a.parentId === item.id).length > 0;
  }

  findGroups(item: IEsGroupedListItem): IEsGroupedListItem[] {
    const groups = [];
    let g = this.items.find(a => a.id === item.parentId);

    if (!g) {
      return groups;
    }

    do {
      groups.push(g);
    }
    while (g = this.items.find(a => a.id === g.parentId));

    return groups.reverse();
  }
}
