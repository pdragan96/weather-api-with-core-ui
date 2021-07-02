import { Component, OnInit, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

import { validationMessage } from './es-validation-message-animations';

@Component({
  selector: 'es-validation-message',
  templateUrl: './es-validation-message.component.html',
  styleUrls: ['./es-validation-message.component.scss'],
  animations: [
    validationMessage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsValidationMessageComponent implements OnInit {
  @Input() message: string;

  constructor() {
    this.message = 'Validation message';
  }

  @HostBinding('@validationMessage')
  get animateValidationMessage() {
    return true;
  }

  ngOnInit() {
  }
}
