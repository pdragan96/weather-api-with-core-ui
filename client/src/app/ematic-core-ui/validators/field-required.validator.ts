import { Directive, Attribute, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[fieldRequired][formControlName],[fieldRequired][formControl],[fieldRequired][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => FieldRequiredValidator), multi: true }
  ]
})
export class FieldRequiredValidator implements Validator {

  constructor(@Attribute('fieldRequired') public fieldRequired: string) {
  }

  validate(field: AbstractControl): { [key: string]: any } | null {
    // self value
    const value = field.value;

    // control field & value
    const controlField = field.root.get(this.fieldRequired);
    const controlValue = controlField.value;

    if (!controlValue) {
      return null;
    }

    // control value true => field is required
    if (controlValue && !value) {
      return {
        fieldRequired: false
      };
    }

    return null;
  }
}
