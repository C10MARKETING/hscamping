import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  contact: any;

  constructor(public navCtrl: NavController, af: AngularFire, public translate: TranslateService) {
    af.database.object('/contact').subscribe(contact => {
      this.contact = contact;
    });
  }

}
