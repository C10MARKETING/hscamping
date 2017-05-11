import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActivityService } from '../../../providers/activity.service';

@Component({
  selector: 'page-activities-filter',
  templateUrl: 'activities-filter.html'
})
export class ActivitiesFilterPage {

  currentFilterObject: any = {};
  resetFilterObject: any = {
      who: "",
      where: "",
      what: "",
      priceCategory: ""
    }

  constructor(public navCtrl: NavController,  private activityService: ActivityService) {
  }

  ionViewWillEnter(){
    this.currentFilterObject = JSON.parse(JSON.stringify(this.activityService.filterObject));
  }

  updateFilter(){
    this.activityService.shouldUpdateActivityList = true;
  }

  reset() {
    this.currentFilterObject = JSON.parse(JSON.stringify(this.resetFilterObject));
    this.activityService.filterObject = JSON.parse(JSON.stringify(this.currentFilterObject));
    this.updateFilter();
  }

  update() {
    this.activityService.filterObject = JSON.parse(JSON.stringify(this.currentFilterObject));
    this.updateFilter();
    this.navCtrl.pop();
  }

}