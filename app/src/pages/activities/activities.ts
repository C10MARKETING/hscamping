import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ActivityDetailPage } from './activity-detail/activity-detail';

import { AngularFire } from 'angularfire2';
import { ActivityService } from '../../providers/activity.service';
import { AuthData } from '../../providers/auth-data';

import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'page-activities',
  templateUrl: 'activities.html'
})
export class ActivitiesPage {

  currentItems: any[];
  activities: any[];
  dates: any[] = [];
  currentSub: any;
  loading: string;
  noActivities: string;
  noDates: string;
  guestOn: string;

  constructor(public navCtrl: NavController, af: AngularFire, public activityService: ActivityService, private translate: TranslateService,
      private userService: UserService, private authData: AuthData) {
    translate.get('ACTIVITIES_LOADING').subscribe(
      value => { this.loading = value })

    translate.get('ACTIVITIES_NO_ACTIVITIES').subscribe(
      value => { this.noActivities = value })
  }

  ionViewWillEnter(){

    this.noDates = this.loading;

    if (this.activityService.shouldUpdateActivityList) {
      this.reloadActivityList();
      this.activityService.shouldUpdateActivityList = false;
    }

    this.currentSub = this.activityService.currentActivities.subscribe(activities => {
      this.currentItems = activities.filter(activity => !this.activityService.isPastActivity(activity));

      // filter out camping exclusive events
      this.currentItems = this.currentItems.filter(activity => (activity.visibleTo === "everyone" || activity.visibleTo === this.getGuestOn()));

      this.reloadActivityList();

      this.currentItems.forEach(activity => {
        this.checkAddDate(activity);
      });

      if (this.dates.length === 0) {
        this.noDates = this.noActivities;
      }

      this.dates.sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

      // show a maximum of 14 days
      if (this.dates.length > 14) {
        this.dates.length = 14;
      }
    });
  }

  ionViewWillLeave(){
    this.currentSub.unsubscribe();
  }

  getGuestOn(){
    return this.authData.fireAuth ? this.userService.getGuestOn(this.authData.fireAuth.uid, this.userService.currentUsers) : "camping";
  }

  reloadActivityList(){
      //filter activities according to current filter
      if (this.activityService.filterObject) {
        this.currentItems = this.currentItems.filter(activity => (
          (activity.who === this.activityService.filterObject.who || this.activityService.filterObject.who === "") &&
          (activity.where === this.activityService.filterObject.where || this.activityService.filterObject.where === "") &&
          (activity.what === this.activityService.filterObject.what || this.activityService.filterObject.what === "") &&
          (activity.priceCategory === this.activityService.filterObject.priceCategory || this.activityService.filterObject.priceCategory === "")
        ));
      }
      this.dates = [];
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

