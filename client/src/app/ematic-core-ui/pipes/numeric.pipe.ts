import { Pipe, PipeTransform } from '@angular/core';

import { CommonUtil } from '../util/common-util';

@Pipe({
  name: 'numeric'
})
export class NumericPipe implements PipeTransform {
  transform(value: any, decimalPlaces = 2, isLarge = false): any {
    if (isLarge && value && value >= 1000000) {
      return CommonUtil.formatNumber(value / 1000000, 1) + 'm';
    } else if (isLarge && value && value > 1000) {
      return CommonUtil.formatNumber(value / 1000, decimalPlaces) + 'k';
    }
    return CommonUtil.formatNumber(value, decimalPlaces);
  }
}
