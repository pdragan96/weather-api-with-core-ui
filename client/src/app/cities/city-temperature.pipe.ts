import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temp',
})
export class CityTemperature implements PipeTransform {
  transform(tempKel: number) {
    tempKel -= 273.15;
    return (Math.round(tempKel * 100) / 100).toFixed(1);
  }
}
