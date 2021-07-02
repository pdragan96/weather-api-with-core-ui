import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';
import { CommonUtil } from '../util/common-util';

@Directive({
  selector: '[urlValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => UrlValidator), multi: true }
  ]
})
export class UrlValidator implements Validator {

  constructor() {
  }

  validate(c: FormControl): ValidationErrors | null {
    return CommonUtil.validateUrl(c.value);
  }
}
