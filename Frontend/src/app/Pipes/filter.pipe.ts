import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], filter: string, propertyName: string): any[] {
    const result = [];
    if (value.length === 0 || filter === '' || propertyName === '') {
      return value;
    }

    for (const item of value) {
      if (item[propertyName] === filter) {
        result.push(item);
      }
    }

    return result;
  }

}
