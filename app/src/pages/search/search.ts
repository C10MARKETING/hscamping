import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { ActivityService } from '../../providers/activity.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchListPage } from './search-list';
import * as moment from 'moment';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  selectedDate: Date;

  da: any;
  de: any;

  lang: any;

  constructor(public navCtrl: NavController, params: NavParams, public activityService: ActivityService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.da = {
        firstDayOfWeek: 1,
        dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
        dayNamesShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
        dayNamesMin: ["Sø","Ma","Ti","On","To","Fr","Lø"],
        monthNames: [ "Januar","Februar","Marts","April","Maj","Juni","Juli","August","September","Oktober","November","December" ],
        monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Aug", "Sep", "Okt", "Nov", "Dec" ]
    };
    this.de = {
        firstDayOfWeek: 1,
        dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        monthNames: [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
        monthNamesShort: [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ]
    };
    this.lang = this.translate.currentLang === 'de' ? this.de : this.da;
  }

  search(event:any) {
    this.activityService.searchObject = { searchMode: 'string', searchRule: event.target.value};
    this.navCtrl.push(SearchListPage);
  }

  showDate() {
    this.activityService.searchObject = { searchMode: 'date', searchRule: moment(this.selectedDate).format('YYYY-MM-DD')};
    this.navCtrl.push(SearchListPage);
  }

  ionViewWillEnter(){
    this.selectedDate = null;
    this.activityService.resetSearch();
  }

}
