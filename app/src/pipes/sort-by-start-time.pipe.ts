import { Pipe, PipeTransform } from '@angular/core';
/*
 * Converts minutes passed since midnight to time of day
 * Usage:
 *   value | minutesToTimeOfDay
 * Example:
 *   {{ 123 |  minutesToTimeOfDay}}
 *   formats to: 02:03
*/
@Pipe({name: 'sortByStartTime'})
export class SortByStartTimePipe implements PipeTransform {
  transform(arr: any[], activity:boolean) {
    if (arr == null) return;

    if (activity) {

      return arr.sort((a, b) => {
        if (a.activity.startTimeInMinutes > b.activity.startTimeInMinutes) {
          return 1;
        }
        if (a.activity.startTimeInMinutes < b.activity.startTimeInMinutes) {
          return -1;
        }
        return 0;
      });

    }

    return arr.sort((a, b) => {
      if (a.startTimeInMinutes > b.startTimeInMinutes) {
        return 1;
      }
      if (a.startTimeInMinutes < b.startTimeInMinutes) {
        return -1;
      }
      return 0;
    });
  }
}