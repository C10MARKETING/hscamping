import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as moment from 'moment'

@Injectable()
export class ActivityService {

  currentActivities: FirebaseListObservable<any[]>;

  /*  {
    searchMode: 'date' / 'string',
    searchRule: 'dateString' / 'filterString'
  }*/
  searchObject: any;
  
  filterObject = {
      who: "",
      where: "",
      what: "",
      priceCategory: ""
    }

  shouldUpdateActivityList: boolean = false;

  constructor(public af: AngularFire) {
    this.currentActivities = af.database.list('/activities');
  }

  resetSearch() {
    this.searchObject = null;
  }

  resetFilter() {
    this.filterObject = null;
  }

  isPastActivity(activity) {
    return moment(activity.date).add(activity.endTimeInMinutes, 'minutes').isBefore(moment())
  }

}
