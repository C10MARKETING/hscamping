import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ActivityDetailPage } from '../activities/activity-detail/activity-detail';

import { AngularFire } from 'angularfire2';
import { ActivityService } from '../../providers/activity.service';
import { UserService } from '../../providers/user.service';
import { AuthData } from '../../providers/auth-data';

import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-search-list',
  templateUrl: 'search-list.html'
})
export class SearchListPage {

  currentItems: any[];
  activities: any[];
  dates: any[] = [];
  currentSub: any;
  currentSearch: string;
  loading: string;
  noActivities: string;
  noDates: string;
  guestOn: string;
  isSubscribed: boolean = false;

  constructor(public navCtrl: NavController, af: AngularFire, public activityService: ActivityService, private translate: TranslateService,
        private userService: UserService, private authData: AuthData) {
      translate.get('ACTIVITIES_LOADING').subscribe(
        value => { this.loading = value })

      translate.get('ACTIVITIES_NO_ACTIVITIES').subscribe(
        value => { this.noActivities = value })
  }

  ionViewWillEnter(){

    this.noDates = this.loading;
    this.currentSearch = this.activityService.searchObject ? this.activityService.searchObject.searchRule : "";

    var that = this;
    if (!this.isSubscribed) {
      this.isSubscribed = true;
      setTimeout(function() { that.subscribe() }, 100);
    }
  }

  subscribe() {
    this.currentSub = this.activityService.currentActivities.subscribe(activities => {
      this.currentItems = activities.filter(activity => !this.activityService.isPastActivity(activity));

      // filter out camping exclusive events
      this.currentItems = this.currentItems.filter(activity => (activity.visibleTo === "everyone" || activity.visibleTo === this.getGuestOn()));

      // match search string with title of each activity
      if (this.activityService.searchObject && this.activityService.searchObject.searchMode === 'string') {
        this.currentItems = this.currentItems.filter(activity => (activity.title[this.translate.currentLang].toLowerCase().includes(this.activityService.searchObject.searchRule.toLowerCase())));
      }
      // match chosen date with date of each activity
      else if (this.activityService.searchObject && this.activityService.searchObject.searchMode === 'date') {
        this.currentItems = this.currentItems.filter(activity => (activity.date === this.activityService.searchObject.searchRule));
      }

      this.dates = [];

      this.currentItems.forEach(activity => {
        this.checkAddDate(activity);
      });

      if (this.dates.length === 0) {
        this.noDates = this.noActivities;
      }

      this.dates.sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

/*      if (this.dates.length > 2) {
        this.dates.length = 2;
      }*/
    });
  }

  ngOnDestroy(){
    this.currentSub.unsubscribe();
  }

  getGuestOn(){
    return this.authData.fireAuth ? this.userService.getGuestOn(this.authData.fireAuth.uid, this.userService.currentUsers) : "camping";
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(key: string) {
    this.navCtrl.push(ActivityDetailPage, {
      key: key
    });
  }

  getActivities(date:any){
    const res: any[] = [];
    this.activities = [];

    this.currentItems.forEach(activity => {
      this.activities.push(activity);
    });

    //only return activities corresponding to the input date
    this.activities.forEach(activity => {
      if (activity.date === date) {
        res.push(activity);
      }
    })
    return res;
  }

  checkAddDate(activity:any){
    if(this.dates.indexOf(activity.date) < 0) {
      this.dates.push(activity.date);
    }
  }

}