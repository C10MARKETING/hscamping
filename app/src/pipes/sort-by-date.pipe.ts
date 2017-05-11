import { Pipe, PipeTransform } from '@angular/core';
/*
 * Converts minutes passed since midnight to time of day
 * Usage:
 *   value | minutesToTimeOfDay
 * Example:
 *   {{ 123 |  minutesToTimeOfDay}}
 *   formats to: 02:03
*/
@Pipe({name: 'sortByDate'})
export class SortByDatePipe implements PipeTransform {
  transform(arr: any[]) {
    if (arr == null) return;

    return arr.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });
  }
}