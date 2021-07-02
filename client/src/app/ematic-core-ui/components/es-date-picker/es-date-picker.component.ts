import { Component, ElementRef, Renderer2, Optional, Self, ChangeDetectorRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import * as moment from 'moment';

import { EsDropdownField } from '../base/es-dropdown-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-date-picker',
  templateUrl: './es-date-picker.component.html',
  styleUrls: ['./es-date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsDatePickerComponent extends EsDropdownField<Date> {

  @Input() displayFormat: string;

  @Input() todayButton: boolean;

  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() isMonthViewSelected: boolean;
  @Input() hasNextAndPreviousButtons: boolean;

  get today() {
    return this.isMonthViewSelected ? 'This Month' : 'Today';
  }

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

    this.todayButton = true;
    this.isMonthViewSelected = false;
    this.hasNextAndPreviousButtons = false;
  }

  getDisplayFormat(): string {
    return this.displayFormat ?? (this.isMonthViewSelected ? 'MM/YYYY' : 'DD/MM/YYYY');
  }

  // override from EsDropdownField
  public getDisplayText(): string {
    return moment(this.innerValue).format(this.getDisplayFormat());
  }

  onDateSelect(date: Date) {
    this.innerValue = date;
  }

  onToday() {
    this.innerValue = moment(new Date()).startOf(this.isMonthViewSelected ? 'month' : 'day').toDate();
    this.hideItems();
  }

  onNextDateClick() {
    const nextDay = moment(this.innerValue).startOf('day').add(1, 'days').toDate();

    if (moment(nextDay).isSameOrBefore(this.maxDate, 'day') || !this.maxDate) {
      this.innerValue = nextDay;
    }

    this.hideItems();
  }

  onPreviousDateClick() {
    const previousDay = moment(this.innerValue).startOf('day').subtract(1, 'days').toDate();

    if (moment(previousDay).isSameOrAfter(this.minDate, 'day') || !this.minDate) {
      this.innerValue = previousDay;
    }

    this.hideItems();
  }

  shouldDisableIcon(type: 'next' | 'previous'): boolean {
    switch (type) {
      case 'next':
        return !!(this.maxDate && moment(this.innerValue).isSame(this.maxDate, 'day'));
      case 'previous':
        return !!(this.minDate && moment(this.innerValue).isSame(this.minDate, 'day'));
    }
  }
}
