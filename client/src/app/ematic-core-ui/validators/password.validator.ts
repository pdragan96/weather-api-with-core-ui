import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[passwordValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordValidator), multi: true }
  ]
})
export class PasswordValidator implements Validator {

  constructor() {
  }

  static hasLowerCase(str) {
    return str.toUpperCase() !== str;
  }

  static hasUpperCase(str) {
    return str.toLowerCase() !== str;
  }

  validate(c: FormControl): { [key: string]: any } {
    const passwordReg = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/i;
    return passwordReg.test(c.value) && PasswordValidator.hasLowerCase(c.value) && PasswordValidator.hasUpperCase(c.value)
      ? null
      : { passwordValidation: 'Password must contain lower case, upper case, number and minimum 8 characters.' };
  }
}
