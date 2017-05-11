import { Component, ViewChild } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ActivityService } from '../../providers/activity.service';

import { Tabs } from 'ionic-angular';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { Tab4Root } from '../pages';
import { Tab5Root } from '../pages';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab5Root: any = Tab5Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";
  tab5Title = " ";

  subscription: any;

  @ViewChild('footerTabs') tabs:Tabs;
  
  constructor(public translate: TranslateService, public activityService: ActivityService) {
    this.updateText();
    this.subscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateText();
    });
  }

  updateText() {
    this.translate.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE', 'TAB4_TITLE', 'TAB5_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
      this.tab4Title = values['TAB4_TITLE'];
      this.tab5Title = values['TAB5_TITLE'];
    });
  }

  ionViewWillEnter()
  {
    this.tabs._tabs[0]._isShown = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  
}
