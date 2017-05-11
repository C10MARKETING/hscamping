import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'; //todo: remove this once login is working
import { LoginPage } from '../login/login';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'page-get-started',
  templateUrl: 'get-started.html'
})
export class GetStartedPage {

  @ViewChild('getStartedSlider') slider: Slides;

  tabsPage = TabsPage;
  loginPage = LoginPage;
  paginationAfter : string;

  currentIndex = 0;
  skip: string;
  start: string;

  subscription: any;

  constructor(public navCtrl: NavController, public translate: TranslateService) {

    this.updateTexts();

    this.subscription = translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTexts();
    });
  }

  updateTexts() {

    this.translate.get('GETSTARTED_SKIP').subscribe(
      value => {
        this.skip = value;
        this.updatePaginationText()
      })
  
    this.translate.get('GETSTARTED_START').subscribe(
      value => {
        this.start = value
        this.updatePaginationText()
      })

  }

  ionViewWillEnter(){
    this.paginationAfter = this.skip;
  }

  onSlideWillChange() {
    this.currentIndex = this.slider.getActiveIndex();
    this.updatePaginationText();
  }

  updatePaginationText() {
    if (!this.slider) return
    if (this.slider.isEnd()) {
      this.paginationAfter = this.start;
    }
    else {
      this.paginationAfter = this.skip;
    }
  }

  getContainerClass() {

    var res = '';

    switch (this.currentIndex){
      case 1: res = 'getStarted1';
      break;
      case 2: res = 'getStarted2';
      break;
      case 3: res = 'getStarted2';
      break;
    }

    return res;

  }

  leaveGetStartedPage(){
    this.navCtrl.setRoot(this.loginPage);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
