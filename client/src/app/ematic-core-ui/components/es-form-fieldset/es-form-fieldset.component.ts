import { Component, OnInit, Input, OnChanges,
  ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  selector: 'es-form-fieldset',
  templateUrl: './es-form-fieldset.component.html',
  styleUrls: ['./es-form-fieldset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsFormFieldsetComponent implements OnInit, OnChanges {
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  public onChanges: EventEmitter<void>;

  constructor() {
    this.disabled = false;
    this.readonly = false;

    this.onChanges = new EventEmitter<void>();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.onChanges.emit();
  }

}
