import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ActivityDetailPage } from '../activities/activity-detail/activity-detail';

import { AngularFire } from 'angularfire2';
import { AuthData } from '../../providers/auth-data';
import { ActivityService } from '../../providers/activity.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  currentItems: any[];
  signedUpFor: any[] = [];
  interestedIn: any[] = [];
  activities: any[] = [];
  dates: any[] = [];
  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController, private activityService: ActivityService, private authData: AuthData,
      private af: AngularFire, private translate: TranslateService) {
  }

  ionViewWillEnter(){
    this.isLoggedIn = this.authData.fireAuth;

    this.activityService.currentActivities.subscribe(activities => {
      this.currentItems = activities.filter(activity => !this.activityService.isPastActivity(activity));
      this.currentItems.forEach(activity => this.mapToLists(activity));
    });
  }

    /**
   * Navigate to the detail page for this item.
   */
  openItem(key: string) {
    this.navCtrl.push(ActivityDetailPage, {
      key: key
    });
  }

  mapToLists(activity:any){
    this.signedUpFor = [];
    this.interestedIn = [];
    this.dates = [];

    if (!this.authData.fireAuth) return;

    var subParticipants = this.af.database.list('activities/'+ activity.$key + '/participants').subscribe(participants => {
      participants.forEach(participant => {
        if (participant.uid == this.authData.fireAuth.uid)
        {
          this.signedUpFor.push(activity);
          this.checkAddDate(activity);
        }
      });
      subParticipants.unsubscribe();
    });

    var subInterestedIn = this.af.database.list('activities/'+ activity.$key + '/interestedIn').subscribe(persons => {
      persons.forEach(person => {
        if (person.uid == this.authData.fireAuth.uid)
        {
          this.interestedIn.push(activity);
          this.checkAddDate(activity);
        }
      });
      subInterestedIn.unsubscribe();
    });

  }

  checkAddDate(activity:any){
      if(this.dates.indexOf(activity.date) < 0) {
        this.dates.push(activity.date);
      }
  }

  getActivities(date:any){
    const res: any[] = [];
    this.activities = [];

    this.signedUpFor.forEach(activity => {
      this.activities.push({activity: activity, subscribed: true});
    });

    this.interestedIn.forEach(activity => {
      //we dont want to add an interestedIn(activity) if the user is already subscribed to it

      let shouldBeAdded: boolean = true;

      this.activities.forEach(currentActivity => {
        if (currentActivity.activity.$key === activity.$key) {
          shouldBeAdded = false;
        }
      })

      if(shouldBeAdded) {
        this.activities.push({activity: activity, subscribed: false});
      }
    });

    //only return activities corresponding to the input date
    this.activities.forEach(activity => {
      if (activity.activity.date === date) {
        res.push(activity);
      }
    })
    return res;
  }

}
