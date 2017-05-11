import { Component, Input } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { ActivitiesFilterPage } from '../activities/activities-filter/activities-filter';
import { SettingsPage } from '../profile/settings';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-nav-header',
  templateUrl: 'nav-header.html'
})
export class NavHeaderPage {

  activitiesFilterPage = ActivitiesFilterPage;
  settingsPage = SettingsPage;

  @Input() showActivitesFilterButton : boolean;
  @Input() showSettingsButton : boolean;
  @Input() showGoToLoginButton : boolean;

  constructor(public navCtrl: NavController, private appCtrl: App) {

  }

  goToLogin(){
    this.appCtrl.getRootNav().popToRoot();
    this.appCtrl.getRootNav().push(LoginPage);
  }

  goToHome(){
    this.appCtrl.getRootNav().popToRoot();
    this.appCtrl.getRootNav().push(TabsPage);
  }

}
