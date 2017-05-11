import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { TranslateService } from '@ngx-translate/core';
import { App } from 'ionic-angular';
import { ActivityDetailPage } from '../pages/activities/activity-detail/activity-detail';
import * as moment from 'moment'

@Injectable()
export class NotificationsService {

  activityIn: string;
  minutes: string;

  constructor(private translate: TranslateService, private app: App, private LocalNotifications: LocalNotifications, private platform: Platform) {

    this.translate.get('NOTIFICATIONS_ACTIVITYSTARTSIN').subscribe(
      value => { this.activityIn = value; })

    this.translate.get('NOTIFICATIONS_MINUTES').subscribe(
      value => { this.minutes = value; })

      if (platform.is('cordova')) {
        this.LocalNotifications.on('click', (event) => {
          console.log(event)
          let data = JSON.parse(event.data)
          this.openItem(data.aid) 
        });
      }
  }

  deleteNotification(activity) {
    if (!this.platform.is('cordova')) return;
    return this.LocalNotifications.getAll().then((res) => {
      console.log(res);
      res.forEach(notification => {
        let data = JSON.parse(notification.data);
        if (data.aid === activity.$key) {
          this.LocalNotifications.cancel(notification.id);
          console.log("notification deleted: " + activity.title[this.translate.currentLang]);
        }
      })
    });
  }

  createNotification(activity) {
    if (!this.platform.is('cordova')) return;
    if (activity.pushNotificationMinInAdvance === 0) return;

    // check if activity exists in array of current notifications
    this.LocalNotifications.getAll().then((res) => {
      console.log(res);
      res.forEach(notification => {
        let data = JSON.parse(notification.data);
        if (data.aid === activity.$key) {
          return;
        }
      })
      this.LocalNotifications.schedule({
        id: res.length,
        at: moment(activity.date).add(activity.startTimeInMinutes, 'minutes').valueOf() - activity.pushNotificationMinInAdvance*60*1000,
        title: activity.title[this.translate.currentLang],
        text: this.activityIn + " " + activity.pushNotificationMinInAdvance + " " + this.minutes,
        data: { aid: activity.$key, startsIn: activity.pushNotificationMinInAdvance }
      });
      console.log(activity.title[this.translate.currentLang] + " created at: " + activity.date + " " + activity.startTimeInMinutes + " (" + activity.pushNotificationMinInAdvance*60*1000 + " in advance)");
    });

  }
  
  /**
   * Navigate to the detail page for the activity of the clicked notification
   */
  openItem(key: string) {
    this.app.getActiveNav().push(ActivityDetailPage, {
      key: key
    });
  }

}
