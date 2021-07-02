import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';

import { CommonUtil } from '../util/common-util';

@Directive({
  selector: '[ematicEmailValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmaticEmailValidator), multi: true }
  ]
})
export class EmaticEmailValidator implements Validator {

  constructor() {
  }

  validate(c: FormControl): ValidationErrors | null {
    return CommonUtil.isEmaticEmail(c.value)
      ? null
      : { emailValidation: 'Email must end with ematicsolutions.com or elixusagency.com.' };
  }
}
