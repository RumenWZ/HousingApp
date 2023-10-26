import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], filter: string, propertyName: string): any[] {
    const result = [];
    if (value?.length === 0 || filter === '' || propertyName === '') {
      return value;
    }

    filter = filter.toLowerCase();

    for (const item of value) {
      if (item[propertyName].toLowerCase().includes(filter)) {
        result.push(item);
      }
    }
    return result;
  }

}
