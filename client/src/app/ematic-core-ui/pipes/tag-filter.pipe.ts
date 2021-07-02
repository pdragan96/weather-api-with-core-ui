import { Pipe, PipeTransform } from '@angular/core';

import { IEsTag } from '../components/es-tag-select/es-tag';

@Pipe({
  name: 'tagFilter'
})
export class TagFilterPipe implements PipeTransform {

  transform(tags: IEsTag[], filterText: string): any {
    return tags.filter(
      (tag: IEsTag) =>
        tag.display.toLowerCase().indexOf(filterText) > -1 ||
        (typeof tag.value === 'string'
          ? tag.value.toLowerCase().indexOf(filterText) > -1
          : tag.value === +filterText)
    );
  }
}
