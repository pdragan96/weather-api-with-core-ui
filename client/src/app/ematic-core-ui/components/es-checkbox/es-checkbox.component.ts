import {
  Component,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  Optional,
  Self,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';

import { EsField } from '../base/es-field';
import { EsFormFieldComponent } from '../es-form-field/es-form-field.component';
import { EsFormFieldsetComponent } from '../es-form-fieldset/es-form-fieldset.component';

@Component({
  selector: 'es-checkbox',
  templateUrl: './es-checkbox.component.html',
  styleUrls: ['./es-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsCheckboxComponent extends EsField<boolean> {
  @Input() labelText: string;
  @Input() labelPosition: 'left' | 'right';

  @Input() htmlMode: boolean;
  @Input() isChecked: boolean;

  @Output() changed: EventEmitter<boolean>;

  // override from EsField
  public get isEsFocusable(): boolean {
    return false;
  }

  public get isEsCursorPointer(): boolean {
    return !this.isEsDisabled;
  }

  public get isEsCursorText(): boolean {
    return false;
  }

  get showLeftLabel(): boolean {
    return !this.compact && this.labelPosition === 'left';
  }

  get showRightLabel(): boolean {
    return !this.compact && this.labelPosition === 'right';
  }

  get showCheck(): boolean {
    return this.htmlMode ? this.isChecked : !!this.innerValue;
  }

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

    this.labelText = '';
    this.labelPosition = 'right';

    this.htmlMode = false;
    this.isChecked = false;
    this.changed = new EventEmitter<boolean>();
  }

  onChange(event: Event) {
    if (this.htmlMode) {
      this.isChecked = (<HTMLInputElement>event.target).checked;
      this.changed.emit(this.isChecked);
    }
  }
}
