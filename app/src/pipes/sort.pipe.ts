import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sort'})
export class SortPipe implements PipeTransform {
  transform(arr: any[]) {
    if (arr === null) return;

    return arr.sort((a, b) => {
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }
}