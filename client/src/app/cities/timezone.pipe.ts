import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezone'
})
export class Timezone implements PipeTransform {

  transform (timezone: number) {
    if ( timezone === -43200 ) return 'UTC -12:00';
    if ( timezone === -39600 ) return 'UTC -11:00';
    if ( timezone === -36000 ) return 'UTC -10:00';
    if ( timezone === -34200 ) return 'UTC -09:30';
    if ( timezone === -32400 ) return 'UTC -9:00';
    if ( timezone === -28800 ) return 'UTC -8:00';
    if ( timezone === -25200 ) return 'UTC -7:00';
    if ( timezone === -21600 ) return 'UTC -6:00';

    if ( timezone === -18000 ) return 'UTC -5:00';
    if ( timezone === -16200 ) return 'UTC -04:30';
    if ( timezone === -14400 ) return 'UTC -4:00';
    if ( timezone === -12600 ) return 'UTC -03:30';
    if ( timezone === -10800 ) return 'UTC -03:00';
    if ( timezone === -7200 ) return 'UTC -2:00';
    if ( timezone === -3600 ) return 'UTC -1:00';

    if ( timezone === 0 ) return 'UTC 00:00';
    if ( timezone === 3600 ) return 'UTC +01:00';
    if ( timezone === 7200 ) return 'UTC +02:00';
    if ( timezone === 10800 ) return 'UTC +03:00';
    if ( timezone === 12600 ) return 'UTC +03:30';
    if ( timezone === 14400 ) return 'UTC +04:00';
    if ( timezone === 16200 ) return 'UTC +04:30';
    if ( timezone === 18000 ) return 'UTC +05:00';

    if ( timezone === 19800 ) return 'UTC +05:30';
    if ( timezone === 20700 ) return 'UTC +05:45';
    if ( timezone === 21600 ) return 'UTC +06:00';
    if ( timezone === 23400 ) return 'UTC +06:30';
    if ( timezone === 25200 ) return 'UTC +07:00';
    if ( timezone === 28800 ) return 'UTC +08:00';
    if ( timezone === 32400 ) return 'UTC +09:00';
    if ( timezone === 34200 ) return 'UTC +09:30';

    if ( timezone === 36000 ) return 'UTC +10:00';
    if ( timezone === 37800 ) return 'UTC +10:30';
    if ( timezone === 39600 ) return 'UTC +11:00';
    if ( timezone === 41400 ) return 'UTC +11:30';
    if ( timezone === 43200 ) return 'UTC +12:00';
    if ( timezone === 45900 ) return 'UTC +12:45';
    if ( timezone === 46800 ) return 'UTC +13:00';
    if ( timezone === 50400 ) return 'UTC +14:30';



    return timezone;
  }

}
