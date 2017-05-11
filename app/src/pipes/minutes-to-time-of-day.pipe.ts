import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
/*
 * Converts minutes passed since midnight to time of day
 * Usage:
 *   value | minutesToTimeOfDay
 * Example:
 *   {{ 123 |  minutesToTimeOfDay}}
 *   formats to: 02:03
*/
@Pipe({name: 'minutesToTimeOfDay'})
export class MinutesToTimeOfDayPipe implements PipeTransform {
  transform(value: number) {
    return moment.utc().startOf('day').add(value, 'minutes').format("HH:mm")
  }
}