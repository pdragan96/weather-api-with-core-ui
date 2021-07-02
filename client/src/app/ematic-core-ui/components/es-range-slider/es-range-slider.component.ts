import {
  Component, OnInit, ElementRef, Renderer2, ChangeDetectorRef,
  Optional, Self, Input, ChangeDetectionStrategy, DoCheck
} from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { EsField } from './../base/es-field';
import { EsFormFieldComponent } from './../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from './../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-range-slider',
  templateUrl: './es-range-slider.component.html',
  styleUrls: ['./es-range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsRangeSliderComponent extends EsField<number> implements OnInit, DoCheck {
  @Input() labelText: string;
  @Input() labelPosition: 'left' | 'right';

  @Input() step: number;
  @Input() min: number;
  @Input() max: number;

  get showLeftLabel(): boolean {
    return !this.compact && this.labelPosition === 'left';
  }

  get showRightLabel(): boolean {
    return !this.compact && this.labelPosition === 'right';
  }

  backgroundSize: string;

  constructor(element: ElementRef,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() esFormFieldset: EsFormFieldsetComponent,
    @Optional() esFormField: EsFormFieldComponent,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Self() @Optional() control: NgControl) {

    super(element, renderer, changeDetectorRef, esFormFieldset, esFormField, parentForm, parentFormGroup, control);

    this.labelText = '';
    this.labelPosition = 'left';
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.updateSliderBackground();
  }

  updateSliderBackground() {
    if (this.innerValue < this.min) {
      this.backgroundSize = '0% 100%';
      return;
    }

    if (this.innerValue > this.max) {
      this.backgroundSize = '100% 100%';
      return;
    }

    this.backgroundSize = (this.innerValue - this.min) * 100 / (this.max - this.min) + '% 100%';
  }
}
