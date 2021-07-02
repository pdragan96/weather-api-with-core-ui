import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';

import { CommonUtil } from '../util/common-util';

@Directive({
  selector: '[nonEmaticEmailValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => NonEmaticEmailValidator), multi: true }
  ]
})
export class NonEmaticEmailValidator implements Validator {

  constructor() {
  }

  validate(c: FormControl): ValidationErrors | null {
    return CommonUtil.isEmaticEmail(c.value)
      ? { emailValidation: 'Email must not end with ematicsolutions.com or elixusagency.com.' }
      : null;
  }
}
