import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { EsDatePickerComponent } from '../es-date-picker/es-date-picker.component';
import { EsLookupComponent } from '../es-lookup/es-lookup.component';
import { EsMultiSelectComponent } from '../es-multi-select/es-multi-select.component';
import { EsSelectComponent } from '../es-select/es-select.component';
import { EsRangePickerComponent } from '../es-range-picker/es-range-picker.component';
import { EsRange } from '../es-range-picker/es-range';
import { StateService } from '../../services/state/state.service';

export enum EsHeaderFilterType {
  NONE,
  TEXT,
  NUMBER,
  LOOKUP,
  MULTI_SELECT,
  DATE,
  DATE_RANGE,
  SELECT
}

export interface IFilter {
  name: string;
  modelProperty?: string;
  value?: any;
}

export interface ISorter {
  columnName: string;
  direction: string;
}

@Component({
  selector: 'es-header-filter',
  templateUrl: './es-header-filter.component.html',
  styleUrls: ['./es-header-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsHeaderFilterComponent implements OnInit, OnDestroy {
  @Input() type: EsHeaderFilterType;
  @Input() sortAsc: boolean;
  @Input() sortable: boolean;

  @Input() filterName: string;
  @Input() stateId: string;
  @Input() modelProperty: string;
  @Input() debounceTime: number;

  @Input() headerText: string;

  @Input() valueField?: string;
  @Input() displayField?: string;

  @Input() searchable?: boolean;

  @Input() availableDatesFrom?: Date;
  @Input() availableDatesTo?: Date;
  @Input() initialStartDate?: Date;
  @Input() initialEndDate?: Date;

  @Input() displayWith?: (item: any) => string;
  @Input() query?: () => Observable<any>;

  @Output() sort: EventEmitter<ISorter>;
  @Output() filterChanged: EventEmitter<IFilter>;

  @ViewChild('inputField') inputField: ElementRef;
  @ViewChild(EsDatePickerComponent) datePicker: EsDatePickerComponent;
  @ViewChild(EsRangePickerComponent) rangePicker: EsRangePickerComponent;
  @ViewChild(EsLookupComponent) lookup: EsLookupComponent;
  @ViewChild(EsMultiSelectComponent) multiSelect: EsMultiSelectComponent;
  @ViewChild(EsSelectComponent) select: EsSelectComponent;

  filterValue: any;
  maxDate: Date;

  get filterText() {
    if (this.filterValue) {
      if (this.type === EsHeaderFilterType.LOOKUP && this.lookup) {
        return this.lookup.getDisplayText();
      }

      if (this.type === EsHeaderFilterType.DATE && this.datePicker) {
        return this.datePicker.getDisplayText();
      }

      if (this.type === EsHeaderFilterType.DATE_RANGE && this.rangePicker) {
        return this.rangePicker.getDisplayText();
      }

      if (this.type === EsHeaderFilterType.MULTI_SELECT && this.multiSelect) {
        return this.multiSelect.getDisplayText();
      }

      if (this.type === EsHeaderFilterType.SELECT && this.select) {
        return this.select.getDisplayText();
      }
    }

    return null;
  }

  get inputFilter(): boolean {
    return this.type === EsHeaderFilterType.TEXT || this.type === EsHeaderFilterType.NUMBER;
  }

  get dropdownFilter(): boolean {
    return this.type !== EsHeaderFilterType.NONE && this.type !== EsHeaderFilterType.TEXT && this.type !== EsHeaderFilterType.NUMBER;
  }

  filterType = EsHeaderFilterType;
  subject: Subject<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private stateService: StateService
  ) {
    this.sort = new EventEmitter<ISorter>();
    this.filterChanged = new EventEmitter<IFilter>();
    this.type = EsHeaderFilterType.NONE;
    this.sortAsc = true;
    this.sortable = true;
    this.filterName = 'default';
    this.modelProperty = null;
    this.filterValue = null;
    this.debounceTime = 0;
    this.headerText = 'Column name';

    this.valueField = 'id';
    this.displayField = 'text';
    this.displayWith = null;
    this.searchable = false;

    this.maxDate = new Date();

    this.subject = new Subject<any>();
  }

  ngOnInit() {
    if (this.debounceTime === 0 && (this.type === EsHeaderFilterType.TEXT || this.type === EsHeaderFilterType.NUMBER)) {
      this.debounceTime = 500;
    }

    if (this.stateId) {
      const state = this.stateService.getState(this.stateId);

      if (state && this.type === EsHeaderFilterType.DATE) {
        this.filterValue = new Date(state);
      } else if (state && this.type === EsHeaderFilterType.DATE_RANGE) {
        this.filterValue = new EsRange(state);
      } else {
        this.filterValue = state;
      }

      this.changeDetectorRef.markForCheck();
    }

    this.subject
      .pipe(debounceTime(this.debounceTime))
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        let filter = null;
        if (typeof this.filterValue !== 'undefined' && this.filterValue !== null) {
          if (Array.isArray(this.filterValue)) {
            filter = this.modelProperty ? this.filterValue.map(a => a[this.modelProperty]) : this.filterValue;
          } else {
            filter = this.modelProperty ? this.filterValue[this.modelProperty] : this.filterValue;
          }
        }

        if (this.stateId) {
          this.stateService.setState(this.stateId, this.filterValue);
        }

        this.filterChanged.emit(<IFilter>{
          name: this.filterName,
          modelProperty: this.modelProperty,
          value: filter
        });
      });
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    if (this.type === EsHeaderFilterType.NUMBER) {
      switch (event.code) {
        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
        case 'Backspace':
        case 'Delete':
        case 'ArrowRight':
        case 'ArrowLeft':
          break;
        default:
          event.preventDefault();
          break;
      }
    }
  }

  // getTemplateText(item: any) {
  //   return this.templateTextFunc ? this.templateTextFunc(item) : item[this.lookupDisplayField];
  // }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.sort.emit(<ISorter>{
      columnName: this.filterName,
      direction: this.sortAsc ? 'asc' : 'desc'
    });
  }

  onFilterModelChange(filterValue: any) {
    this.subject.next(filterValue);
  }

  toggleInputFilter() {
    if (this.filterValue === null) {
      this.filterValue = '';
      this.inputField.nativeElement.focus();
    } else {
      this.filterValue = null;
      this.subject.next(this.filterValue);
    }
  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }
}
