import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[ematicKeyValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmaticKeyValidator), multi: true }
  ]
})
export class EmaticKeyValidator implements Validator {

  constructor() {
  }

  validate(c: FormControl): { [key: string]: any } {
    const ematicKeyReg = /^[a-z0-9]{32}-[a-z0-9]{3,5}$/i;
    return ematicKeyReg.test(c.value) ? null : { ematicKeyValidation: 'Ematic key must contain key in format 32 alphanumeric characters, dash, 3 to 5 characters describing data center.' }; // tslint:disable-line:max-line-length
  }
}
