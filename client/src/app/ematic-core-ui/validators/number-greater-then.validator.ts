import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[numberGreaterThen][formControlName],[numberGreaterThen][formControl],[numberGreaterThen][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => NumberGreaterThenValidator), multi: true }
  ]
})
export class NumberGreaterThenValidator implements Validator {

  constructor(@Attribute('numberGreaterThen') public numberGreaterThen: string) {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    const v = c.value;

    // control vlaue
    const e = c.root.get(this.numberGreaterThen);

    if (!e.value) {
      return {
        numberGreaterThen: false
      };
    }

    // value lesser
    if (e && v < e.value) {
      return {
        numberGreaterThen: false
      };
    }

    // value greater or equal
    if (e && v >= e.value) {
      if (c.errors && c.errors['numberGreaterThen']) {
        delete c.errors['numberGreaterThen'];
      }
      if (c.errors && !Object.keys(c.errors).length) {
        c.setErrors(null);
      }
    }

    return null;
  }
}
