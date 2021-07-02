import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';

import * as moment from 'moment-timezone-tsc';
import { range } from 'lodash-es';

import { slide } from './es-date-selector-animations';

export interface Months {
  month: any;
  selected: boolean;
}

type DateSelectorView = 'date' | 'month' | 'year';

@Component({
  selector: 'es-date-selector',
  templateUrl: './es-date-selector.component.html',
  styleUrls: ['./es-date-selector.component.scss'],
  animations: [
    slide
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsDateSelectorComponent implements OnInit, OnChanges {
  @Input() date: Date;
  @Input() firstDayOfWeek: number;
  @Input() displayFormat: string;

  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() dataStartDate: Date;
  @Input() dataEndDate: Date;
  @Input() isRange: boolean;
  @Input() isMonthViewSelected: boolean;

  @Output() selected: EventEmitter<Date>;
  @Output() closeDropdown: EventEmitter<void>;

  numberOfWeeks: number;
  weeks: any[];

  dayNames: any[];
  weekDays: any[];

  years: any[];
  months: Months[] = [];

  dates: any[];

  month: Date;
  view: DateSelectorView;

  animationTrigger: string;

  getFormattedValue(format?: string): string {
    if (!format) {
      format = this.displayFormat;
    }
    return moment(this.date).format(format);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.dates = [];
    this.numberOfWeeks = 6;

    this.firstDayOfWeek = 1; // Monday
    this.dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    this.displayFormat = 'DD/MM/YYYY';
    this.view = 'date';

    this.minDate = null;
    this.maxDate = null;
    this.isRange = false;
    this.dataStartDate = null;
    this.dataEndDate = null;
    this.isMonthViewSelected = false;

    this.weeks = Array.from({ length: this.numberOfWeeks });

    this.animationTrigger = 'reset';

    this.selected = new EventEmitter<Date>();
    this.closeDropdown = new EventEmitter<void>();
  }

  ngOnInit() {
    this.date = this.date || new Date();

    this.weekDays = this.dayNames.slice(this.firstDayOfWeek, this.dayNames.length).concat(this.dayNames.slice(0, this.firstDayOfWeek));
    this.month = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.generateCalendar();
    this.updateView();
  }

  ngOnChanges() {
    if (this.dates && this.dates.length > 0) {
      for (let i = 0; i < this.numberOfWeeks * this.weekDays.length ; i++) {
        const date = this.dates[i];
        date['disabled'] = this.isDisabled(new Date(date['year'], date['month'], date['day']));
      }

      if (this.isRange) {
        this.dates.forEach((d) => {
          d['inRange'] = this.inRange(new Date(d['year'], d['month'], d['day']));
        });
      }
    }

    if (this.isMonthViewSelected) {
      this.view = 'month';
    }
  }

  resetAnimation() {
    this.animationTrigger = 'reset';
  }

  slide(out?: boolean) {
    this.animationTrigger = out ? 'out' : 'in';
    this.changeDetectorRef.markForCheck();
  }

  onSelectedDate(date: any) {
    if (!date['disabled']) {
      const view = this.view;

      switch (view) {
        case 'year':
          const setYear = new Date(date, 0, 1);
          this.date = setYear;
          this.month = setYear;
          this.view = 'month';
          break;
        case 'month':
          const setMonth = new Date(this.month.getFullYear(), date, 1);
          this.date = setMonth;
          this.month = setMonth;
          if (this.isMonthViewSelected) {
            this.closeDropdown.emit();
          } else {
            this.view = 'date';
          }
          break;
        case 'date':
          this.date = new Date(date['year'], date['month'], date['day']);
          this.month = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
          this.closeDropdown.emit();
          break;
      }
      this.updateView();
      this.selected.emit(this.date);
      this.selectDate(date);
    }
  }

  areEqual(dateOne: Date, dateTwo: Date) {
    return dateOne.getFullYear() === dateTwo.getFullYear() &&
           dateOne.getMonth() === dateTwo.getMonth() &&
           dateOne.getDate() === dateTwo.getDate();
  }

  selectDate(date: any) {
    for (const d of this.dates) {
      if (date.day === d.day && date.month === d.month) {
        d['selected'] = true;
        d['inRange'] = this.inRange(new Date(d['year'], d['month'], d['day']));
        break;
      }
    }
  }

  isDisabled(date: Date): boolean {
    let disabled = false;
    const mDate = moment(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

    if (this.minDate && mDate.isBefore(moment(this.minDate).startOf('day'))) {
      disabled = true;
    }

    if (this.dataStartDate && moment(date).isBefore(this.dataStartDate)) {
      disabled = true;
    }

    if (this.maxDate && mDate.isAfter(moment(this.maxDate).startOf('day'))) {
      disabled = true;
    }

    if (this.dataEndDate && moment(date).isAfter(this.dataEndDate)) {
      disabled = true;
    }

    return disabled;
  }

  inRange(date: Date): boolean {
    let inRange = false;
    const mDate = moment(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

    if (this.minDate && mDate.isAfter(moment(this.minDate).startOf('day')) && mDate.isBefore(moment(this.date).startOf('day'))) {
      inRange = true;
    }

    if (this.maxDate && mDate.isAfter(moment(this.date).startOf('day')) && mDate.isBefore(moment(this.maxDate).startOf('day'))) {
      inRange = true;
    }

    return inRange && this.isRange;
  }

  isSelectedMonth(date: Date): boolean {
    return moment(date).isSame(this.month, 'month');
  }

  setView(nextView: DateSelectorView) {
    this.view = nextView;
    this.updateView();
  }

  updateView() {
    event.stopPropagation();
    const view = this.view;
    const date = this.month;

    switch (view) {
      case 'year':
        this.years = this.getVisibleYears(date);
      break;
      case 'month':
        this.getMonths();
      break;
      case 'date':
        this.generateCalendar();
      break;
    }
  }

  onPrevious(num?: number, year?: boolean) {
    return this.onNext(-num || -1, year);
  }

  onNext(num?: number, year?: boolean) {
    num = num || 1;
    switch (this.view) {
      case 'year':
      case 'month':
        this.month =  moment(this.month).add(num, 'year').toDate();
        this.getVisibleYears(moment(this.month).toDate());
      break;
      case 'date':
        this.month = moment(this.month).add(num, year ? 'years' : 'months').toDate();
      break;
    }
    this.updateView();
    this.slide();
  }

  getDateFormat(dateType: string): string {
    const date = moment(this.month);
    if (dateType === 'year') {
      return `${this.years[0]} - ${this.years[this.years.length - 1]}`;
    } else if (dateType === 'month') {
      return date.format('YYYY');
    } else {
      return date.format('MMMM YYYY');
    }
  }

  createNewDate(year, month, day, hour, minute) {
    const timeZone = null;
    const utc = Date.UTC(year || 0, month || 0, day || 0, hour || 0, minute || 0);
    return timeZone ? moment.tz(utc, timeZone) : moment(utc);
  }

  getMonths() {
    this.months = [];
    const shortMonths = moment.monthsShort();
    shortMonths.forEach((item, index) => {
      this.months.push({
        month: item,
        selected: index === this.date.getMonth()
      });
    });
  }

  getVisibleYears(date) {
    const m = moment(date);
    let year = m.year();
    m.year(year - (year % 10));
    year = m.year();

    const years = [];
    let offset = m.utcOffset() / 60,
        pushedDate,
        actualOffset;

    for (let i = 0; i < 12; i++) {
      pushedDate = this.createNewDate(year, 0, 1, 0 - offset, false);
      actualOffset = pushedDate.utcOffset() / 60;
      if (actualOffset !== offset) {
        pushedDate = this.createNewDate(year, 0, 1, 0 - actualOffset, false);
        offset = actualOffset;
      }
      years.push(pushedDate.format('YYYY'));
      year++;
    }
    return years;
  }

  generateCalendar() {
    const val = moment(this.date);
    const today = moment(new Date());

    this.dates = [];

    const firstOfMonth = (new Date(this.month).getDay() + 6) % 7;
    const firstDayOfGrid = moment(this.month).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();

    return range(start, start + this.numberOfWeeks * this.weekDays.length).map((date, i) => {
      const d = moment(firstDayOfGrid).date(date);
      this.dates.push({
        'index': i,
        'year': d.get('year'),
        'month': d.get('month'),
        'day': d.get('date'),
        'today': d.isSame(today, 'day'),
        'selected': d.isSame(val, 'day'),
        'inRange': this.inRange(d.toDate()),
        'disabled': this.isDisabled(d.toDate()),
        'selectedMonth': this.isSelectedMonth(d.toDate())
      });
    });
  }
}
