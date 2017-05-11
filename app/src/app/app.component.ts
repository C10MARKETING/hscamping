import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirstRunPage } from '../pages/pages';
import { MainPage } from '../pages/pages'
import { AngularFire } from 'angularfire2';

import { TranslateService } from '@ngx-translate/core';

import { Firebase } from '@ionic-native/firebase';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any;

  constructor(translate: TranslateService, platform: Platform, public af: AngularFire, private alertCtrl: AlertController, private firebase: Firebase,
  statusBar: StatusBar, splashScreen: SplashScreen) {

    const authObserver = af.auth.subscribe( user => {
      if (user) {
        this.rootPage = MainPage;
        authObserver.unsubscribe();
      } else {
        this.rootPage = FirstRunPage;
        authObserver.unsubscribe();
      }
    });

    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('da');
    translate.use('da')

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        statusBar.overlaysWebView(false);
        splashScreen.hide();
        this.setupPushNotifications();
      }
    });
  }

  setupPushNotifications() {
    this.firebase.getToken()
      .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token', error));

    this.firebase.onTokenRefresh()
      .subscribe((token: string) => console.log(`Got a new token ${token}`));

    this.firebase.onNotificationOpen()
      .subscribe((res) => {
        if(res.tap) {
          // background mode
          console.log("background");
          console.log(res);
        } else if (!res.tap) {
          // foreground mode

          if (!res.body) return;

          let message = "";
          if (res.title) {
            message += res.title + ". ";
          }

          message += res.body;

          let alert = this.alertCtrl.create({
              message: message,
              buttons: [{ text: "Ok", role: 'cancel' } ]
          });
          alert.present();
          console.log("foreground");
          console.log(res);
        }
    });
  }

}
