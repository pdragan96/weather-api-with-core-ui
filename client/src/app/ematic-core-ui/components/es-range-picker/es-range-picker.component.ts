import { Component, OnInit, ElementRef, Renderer2, Optional, Self, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import * as moment from 'moment';

import { EsRange } from './es-range';
import { EsDropdownField } from '../base/es-dropdown-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

type EsRangePickerOptions =
  'this-month' | 'past-month' |
  'this-quarter' | 'past-quarter' |
  'this-year' | 'past-year' |
  'last-7-days' | 'last-14-days' | 'last-30-days' | 'last-60-days' | 'last-90-days' | 'last-180-days' | 'last-365-days';

@Component({
  selector: 'es-range-picker',
  templateUrl: './es-range-picker.component.html',
  styleUrls: ['./es-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsRangePickerComponent extends EsDropdownField<EsRange> implements OnInit {
  @Input() displayFormat: string;
  @Input() closable: boolean;
  @Input() disabled: boolean;
  @Input() availableDatesFrom: Date;
  @Input() availableDatesTo: Date;
  @Input() initialStartDate?: Date;
  @Input() initialEndDate?: Date;
  @Input() showOptions: boolean;

  get today(): Date {
    return new Date();
  }

  dateRange: EsRange;
  startDateMax: Date;
  endDateMin: Date;

  constructor(
    element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() esFormFieldset: EsFormFieldsetComponent,
    @Optional() esFormField: EsFormFieldComponent,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Self() @Optional() control: NgControl
  ) {
    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.displayFormat = 'DD/MM/YYYY';

    this.closable = true;
    this.showOptions = true;
  }

  ngOnInit() {
    this.initDateRange();
  }

  // override from EsDropdownField
  public getDisplayText(): string {
    const startDate = moment(this.innerValue.startDate);
    const endDate = moment(this.innerValue.endDate);
    return `${ startDate.format(this.displayFormat) } - ${ endDate.format(this.displayFormat) }`;
  }

  // override from EsControlValueAccessor
  writeValue(value: EsRange): void {

    if (value) {
      this._innerValue = new EsRange();
      this._innerValue.startDate = value.startDate;
      this._innerValue.endDate = value.endDate;
    }

    this.initDateRange();
    this._changeDetectorRef.markForCheck();
  }

  initDateRange() {
    if (!this.dateRange) {
      this.dateRange = new EsRange();
    }

    if (this._innerValue) {
      this.dateRange.startDate = new Date(
        this._innerValue.startDate.getFullYear(),
        this._innerValue.startDate.getMonth(),
        this._innerValue.startDate.getDate()
      );
      this.dateRange.endDate = new Date(
        this._innerValue.endDate.getFullYear(),
        this._innerValue.endDate.getMonth(),
        this._innerValue.endDate.getDate()
      );

      this.startDateMax = new Date(
        this._innerValue.endDate.getFullYear(),
        this._innerValue.endDate.getMonth(),
        this._innerValue.endDate.getDate()
      );
      this.endDateMin = new Date(
        this._innerValue.startDate.getFullYear(),
        this._innerValue.startDate.getMonth(),
        this._innerValue.startDate.getDate()
      );
    } else {
      if (this.initialStartDate && this.initialEndDate) {
        this.dateRange.startDate = this.initialStartDate;
        this.dateRange.endDate = this.initialEndDate;

        this.startDateMax = this.initialEndDate;
        this.endDateMin = this.initialStartDate;
      } else if (this.initialStartDate && !this.initialEndDate) {
        const initialEndDate = moment(this.initialStartDate).add(30, 'days').toDate();

        this.dateRange.startDate = this.initialStartDate;
        this.dateRange.endDate = initialEndDate;

        this.startDateMax = initialEndDate;
        this.endDateMin = this.initialStartDate;
      } else if (!this.initialStartDate && this.initialEndDate) {
        const initialStartDate = moment(this.initialEndDate).subtract(30, 'days').toDate();

        this.dateRange.startDate = initialStartDate;
        this.dateRange.endDate = this.initialEndDate;

        this.startDateMax = this.initialEndDate;
        this.endDateMin = initialStartDate;
      } else {
        const mEndDate = moment(this.today).add(1, 'months').toDate();

        this.dateRange.startDate = this.today;
        this.dateRange.endDate = mEndDate;

        this.startDateMax = mEndDate;
        this.endDateMin = this.today;
      }
    }
  }

  // override from Field
  public hideItems(): void {
    if (this.closable) {
      super.hideItems();
    }
  }

  // override from DropdownField
  public onDropdownSelect(): void {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      if (!this._clearClicked) {
        this.toggleItems();

        if (!this._itemsVisible && this.closable) {
          this.initDateRange();
        }
      } else {
        this._clearClicked = false;
      }
    }
  }

  onStartDateSelect(date: Date) {
    this.dateRange.startDate = date;
    this.endDateMin = date;
  }

  onEndDateSelect(date: Date) {
    this.dateRange.endDate = date;
    this.startDateMax = date;
  }

  getQuarterRange(year: number, quarter: number): EsRange {
    const range = new EsRange();

    switch (quarter) {
      case 1:
        range.startDate = new Date(year, 0, 1);
        range.endDate = new Date(year, 2, 31);
        break;
      case 2:
        range.startDate = new Date(year, 3, 1);
        range.endDate = new Date(year, 5, 30);
        break;
      case 3:
        range.startDate = new Date(year, 6, 1);
        range.endDate = new Date(year, 8, 30);
        break;
      case 4:
        range.startDate = new Date(year, 9, 1);
        range.endDate = new Date(year, 11, 31);
        break;
    }

    return range;
  }

  onOption(action: EsRangePickerOptions) {
    let startDate: moment.Moment;
    let endDate: moment.Moment;
    let mToday: moment.Moment;
    let quarterRange: EsRange;

    switch (action) {
      case 'this-month':
        startDate = moment([this.today.getFullYear(), this.today.getMonth()]);
        endDate = moment(startDate).endOf('month');

        this.dateRange.startDate = startDate.toDate();
        this.dateRange.endDate = endDate.toDate();
        break;
      case 'past-month':
        startDate = moment([this.today.getFullYear(), this.today.getMonth()]).add(-1, 'month');
        endDate = moment(startDate).endOf('month');

        this.dateRange.startDate = startDate.toDate();
        this.dateRange.endDate = endDate.toDate();
        break;
      case 'this-quarter':
        mToday = moment([this.today.getFullYear(), this.today.getMonth()]);
        quarterRange = this.getQuarterRange(mToday.get('year'), mToday.quarter());

        this.dateRange.startDate = quarterRange.startDate;
        this.dateRange.endDate = quarterRange.endDate;
        break;
      case 'past-quarter':
        mToday = moment([this.today.getFullYear(), this.today.getMonth()]);
        let quarter = mToday.quarter() - 1;
        let year = mToday.get('year');

        if (quarter < 1) {
          quarter = 4;
          year--;
        }

        quarterRange = this.getQuarterRange(year, quarter);

        this.dateRange.startDate = quarterRange.startDate;
        this.dateRange.endDate = quarterRange.endDate;
        break;
      case 'this-year':
        this.dateRange.startDate = new Date(this.today.getFullYear(), 0, 1);
        this.dateRange.endDate = new Date(this.today.getFullYear(), 11, 31);
        break;
      case 'past-year':
        this.dateRange.startDate = new Date(this.today.getFullYear() - 1, 0, 1);
        this.dateRange.endDate = new Date(this.today.getFullYear() - 1, 11, 31);
        break;
      case 'last-7-days':
        this.dateRange.startDate = moment().subtract(7, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
      case 'last-14-days':
        this.dateRange.startDate = moment().subtract(14, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
      case 'last-30-days':
        this.dateRange.startDate = moment().subtract(30, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
      case 'last-60-days':
        this.dateRange.startDate = moment().subtract(60, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
      case 'last-90-days':
        this.dateRange.startDate = moment().subtract(90, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
      case 'last-180-days':
        this.dateRange.startDate = moment().subtract(180, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
      case 'last-365-days':
        this.dateRange.startDate = moment().subtract(365, 'days').toDate();
        this.dateRange.endDate = new Date();
        break;
    }

    this.onApply();
  }

  onApply() {
    const newValue = new EsRange();

    newValue.startDate = this.dateRange.startDate;
    this.startDateMax = this.dateRange.endDate;

    this.endDateMin = this.dateRange.startDate;
    newValue.endDate = this.dateRange.endDate;

    this.innerValue = newValue;

    this.hideItems();
  }

  onCancel() {
    const isClosable = this.closable;
    this.closable = true;
    this.hideItems();
    this.startDateMax = new Date(this.innerValue.endDate);
    this.endDateMin = new Date(this.innerValue.startDate);
    this.dateRange = new EsRange(this.innerValue);
    setTimeout(() => {
      this.closable = isClosable;
    }, 10);
  }

  // override from Field
  public onClear() {
    if (!this.isEsDisabled && !this.isEsReadonly) {
      this.innerValue = null;
      this.dateRange = null;

      this.initDateRange();

      this._clearClicked = true;
      this.hideItems();
    }
  }

  close() {
    this.onCancel();
  }

}
