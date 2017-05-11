import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/min/locales';
import { TranslateService } from '@ngx-translate/core';
/*
 * Converts date object into a localized date string
 * Usage:
 *   YYYY-MM-DD | localizeDate
 * Example:
 *   {{ "2016-01-14" |  localizeDate }}
 *   formats to (currentLang set to 'da'): torsdag, 14. januar 2016
*/
@Pipe({name: 'localizeDate'})
export class LocalizeDatePipe implements PipeTransform {

  currentLang : string;

  constructor(translate: TranslateService){
    this.currentLang = translate.currentLang;
  }

  transform(date: String) {

    let d = moment(date);
    d.locale(this.currentLang);

    let dayOfWeek = d.format('dddd');
    let stringDate = d.format('LL');

    return dayOfWeek + ", " + stringDate;
  }
}