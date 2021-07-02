import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform<T>(value: T[], query: string, propertyName: string, include?: string): T[] {
    if (query && Array.isArray(value)) {
      return value.filter(item => {
        if (include && item[include]) {
          return item[include];
        }

        return (item[propertyName] || '').toLowerCase().lastIndexOf(query.toString().toLowerCase()) !== -1;
      });
    }
    return value;
  }
}
