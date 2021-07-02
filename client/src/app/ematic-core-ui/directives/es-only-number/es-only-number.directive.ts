import { Directive, Input, HostListener } from '@angular/core';
import { CommonUtil } from '../../util/common-util';

@Directive({
  selector: '[esOnlyNumber]'
})
export class EsOnlyNumberDirective {
  @Input() ignoreDecimalSeparator: boolean;

  @HostListener('keydown', ['$event'])
  onOnlyNumbersDirectiveKeyDown(event: KeyboardEvent) {
    return CommonUtil.allowOnlyNumbers(event, this.ignoreDecimalSeparator);
  }
}
