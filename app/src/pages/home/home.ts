import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ActivityDetailPage } from '../activities/activity-detail/activity-detail';
import { ActivityService } from '../../providers/activity.service';
import { UserService } from '../../providers/user.service';
import { AuthData } from '../../providers/auth-data';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  whatsHappening: any[];

  constructor(public navCtrl: NavController, private activityService: ActivityService, private userService: UserService, private authData: AuthData,
       private translate: TranslateService) {

    activityService.currentActivities.subscribe(activities => {
      this.whatsHappening = activities.filter(activity => !this.activityService.isPastActivity(activity));

      // filter out camping exclusive events
      this.whatsHappening = this.whatsHappening.filter(activity => (activity.visibleTo === "everyone" || activity.visibleTo === this.getGuestOn()));

      // sort by date and starttime
      this.whatsHappening.sort((a,b) => {

        var aDate = moment(a.date);
        var bDate = moment(b.date);

        if (aDate.unix() === bDate.unix()) {
          return a.startTimeInMinutes - b.startTimeInMinutes;
        }
        return aDate.unix() - bDate.unix();
      
      });

      if (this.whatsHappening.length > 3) {
        this.whatsHappening.length = 3;
      }

    });

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

  switchLanguage(language: string) {
    if (language === 'da') {
      language = 'de';
    } else {
      language = 'da';
    }
    this.translate.use(language);
  }


}
