import { ChangeDetectorRef, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, Directive } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';

import { Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { EsDropdownField } from './es-dropdown-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

export interface IEsDropdownSelectItem {
  id: any;
  text: string;
  hovered: boolean;
  selected: boolean;
  checked: boolean;
}

@Directive()
export class EsDropdownSelect<T> extends EsDropdownField<T> implements OnInit, OnDestroy {
  public latestQueryString: string;

  public searchField: ElementRef;
  public itemsList: ElementRef;

  @Input()
  public displayWith?: (item?: T) => string;

  @Input()
  public query: (filter?: string) => Observable<T[]>;

  @Input()
  public searchPlaceholder: string;

  @Input()
  public searchable: boolean;

  @Input()
  public lazyLoad: boolean;

  public querySubject: Subject<string>;
  public _items: T[];
  public items: IEsDropdownSelectItem[];

  public isLoading: boolean;

  public highlightedItemIndex: number;
  public originalListHeight: number;

  public _subscription: Subscription;
  public _destroyed: boolean;

  public shouldDisplayLazyLoadingTextOnStart: boolean;

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    esFormFieldset?: EsFormFieldsetComponent,
    esFormField?: EsFormFieldComponent,
    parentForm?: NgForm,
    parentFormGroup?: FormGroupDirective,
    control?: NgControl
  ) {
    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.latestQueryString = '';

    this.searchPlaceholder = 'Search';
    this.searchable = true;
    this.isLoading = false;
    this.lazyLoad = false;

    this._items = [];
    this.items = [];

    this.highlightedItemIndex = 0;

    this.querySubject = new Subject<string>();
    this._subscription = null;
    this._destroyed = false;

    this.shouldDisplayLazyLoadingTextOnStart = true;
  }

  ngOnInit() {
    if (!this.lazyLoad) {
      this.querySubject.pipe(
        tap(() => {
          this.shouldDisplayLazyLoadingTextOnStart = false;
        }),
        distinctUntilChanged())
        .subscribe(query => {
          this.highlightedItemIndex = 0;
          this.onFilter(query);
        });
    } else {
      this.searchable = true;
      this.querySubject.pipe(
        tap(() => {
          this.isLoading = true;
          this.clear();
        }),
        debounceTime(400),
        distinctUntilChanged(),
        tap(queryString => {
          this.latestQueryString = queryString;
          this.shouldDisplayLazyLoadingTextOnStart = false;
        }),
        switchMap(queryString => {
          if (queryString === '') {
            return of([]);
          } else {
            return this.query(queryString).pipe(catchError(() => of([])));
          }
        })
      ).subscribe({
        next: this.onNext.bind(this),
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onDocumentKeydownDropdownSelect(event: KeyboardEvent): void {
    if (this._itemsVisible && !this.isLoading) {
      let newIndex: number;

      switch (event.which || event.keyCode) {
        case 38: // arrowup
          newIndex = this.highlightedItemIndex - 1;
          this.highlightItem(newIndex < 0 ? 0 : newIndex, true);

          event.preventDefault();
          break;
        case 40: // arrowdown
          newIndex = this.highlightedItemIndex + 1;
          this.highlightItem(newIndex > this.items.length - 1 ? this.items.length - 1 : newIndex, true);

          event.preventDefault();
          break;
        case 13: // return
          const highlightedItem = this.items[this.highlightedItemIndex];
          if (highlightedItem) {
            this.onKeyboardReturnPress(highlightedItem, this.highlightedItemIndex);
          }

          event.preventDefault();
          break;
      }
    }
  }

  public onKeyboardReturnPress(item: IEsDropdownSelectItem, highlightedItemIndex: number) {
    throw new Error('Not implemented');
  }

  // override from DropdownField
  public onWindowResizeDropdownField(event): void {
    super.onWindowResizeDropdownField(event);

    if (this._itemsVisible) {
      this.setListHeight();
    }
  }

  public unsubscribe() {
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
    }
  }

  public setListHeight() {
    this._renderer.setStyle(this.itemsList.nativeElement, 'height', this._isMobile ? '100%' : `${ this.originalListHeight }px`);
 }

  public itemsTrackBy(index: number, item: IEsDropdownSelectItem) {
    return item.id;
  }

  public clear(): void {
    this._items = [];
    this.items = [];

    this.highlightedItemIndex = 0;
  }

  public onQueryChange(event: Event) {
    this.querySubject.next((<HTMLInputElement>event.target).value);
  }

  // Should transform this._items to this.items
  public transformItems(): void {
    throw new Error('Not implemented');
  }

  public onFilter(query?: string) {
    throw new Error('Not implemented');
  }

  public mapItem(item: T): T {
    throw new Error('Not implemented');
  }

  public doQuery(): void {
    this.isLoading = true;
    this.clear();

    this._subscription = this.query().subscribe({
      next: this.onNext.bind(this),
      error: () => {
        this.isLoading = false;
      }
    });

    setTimeout(() => {
      this.highlightItem(this.highlightedItemIndex, true);
    }, 110);
  }

  // override from DropdownField
  public onDropdownSelect(): void {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      if (!this._clearClicked) {
        if (!this.lazyLoad) {
          this.clear();
        }
        this.toggleItems();

        if (this._itemsVisible) {
          if (!this.lazyLoad) {
            this.doQuery();
          } else if (this.searchable && this.lazyLoad) {
            // It doesn't work without timeout
            setTimeout(() => {
              if (this.searchField.nativeElement) {
                this.searchField.nativeElement.focus();
              }
            }, 10);
          }
        }
      } else {
        this._clearClicked = false;
      }
    }
  }

  // override from DropdownField
  public hideItems() {
    this.unsubscribe();
    super.hideItems();
  }

  public scrollToItem(index: number): void {
    const li = this.itemsList.nativeElement.querySelector('li');
    if (li) {
      const liRect = li.getBoundingClientRect();
      this.itemsList.nativeElement.scrollTop = index * liRect.height;
    }
  }

  public highlightItem(newIndex: number, highlight: boolean, scroll = true): void {
    const highlightedItem = this.items[this.highlightedItemIndex];
    if (highlightedItem) {
      highlightedItem.hovered = false;
    }

    if (this.items.length > 0) {
      this.items[this.highlightedItemIndex = newIndex].hovered = highlight;
      if (scroll) {
        this.scrollToItem(this.highlightedItemIndex);
      }
    }
  }

  public onItemMouseEnter(event: MouseEvent, index: number) {
    if (!this.isLoading) {
      this.highlightItem(index, true, false);
    }
  }

  // override from Field
  public onClear() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.innerValue = null;
      this._clearClicked = true;
      this.clear();
      this.hideItems();
      this.latestQueryString = '';
    }
  }

  public shouldDisplayTypeToSearchMessage(): boolean {
    return this.items.length === 0 && !this.isLoading && this.shouldDisplayLazyLoadingTextOnStart;
  }

  public shouldDisplayNoResultsFoundMessage(): boolean {
    return this.items.length === 0 && !this.isLoading && !this.shouldDisplayLazyLoadingTextOnStart;
  }

  // override from Field
  ngOnDestroy() {
    super.ngOnDestroy();
    this.querySubject.unsubscribe();
    this.unsubscribe();
  }

  private onNext(items: T[]) {
    this.isLoading = false;
    this._items = items.map(a => this.mapItem(a));

    if (this._itemsVisible) {
      if (this.searchable && this.searchField.nativeElement) {
        this.searchField.nativeElement.focus();
      }

      if (!this.originalListHeight) {
        const listRect = this.itemsList.nativeElement.getBoundingClientRect();
        this.originalListHeight = listRect.height;
      }

      this.setListHeight();
    }

    this.transformItems();

    this._changeDetectorRef.markForCheck();

    setTimeout(() => {
      const scrollToIndex = this.items.findIndex(a => a.selected);
      if (scrollToIndex !== -1) {
        this.highlightedItemIndex = scrollToIndex;
        this.scrollToItem(this.highlightedItemIndex);
      }
    }, 100);
  }
}
