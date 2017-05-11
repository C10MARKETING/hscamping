import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import firebase from 'firebase'
import { AuthData } from '../../../providers/auth-data';
import { UserService } from '../../../providers/user.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { LoginPage } from '../../login/login';
import { NotificationsService } from '../../../providers/notifications.service'

@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html'
})
export class ActivityDetailPage {

  item: any;
  key: any;
  activityObs: FirebaseObjectObservable<any>;
  activity: any = null;
  participantsObs: FirebaseListObservable<any[]>;
  participants: any[] = null;
  participantNames: any[] = []
  interestedInObs: FirebaseListObservable<any[]>;
  interestedIn: any[] = null;
  users: any[] = [];
  signupNotesObs: FirebaseObjectObservable<any>;
  signupNotes: any = null;
  maxAmountOfParticipantsExceeded: string;
  maxAmountOfParticipantsExceededMax: string;
  maxAmountOfParticipantsExceededParticipants: string;
  tooLateToUnsubscribe: string;
  loginToSubscribe: string;
  loginCreateUser: string;

  constructor(public navCtrl: NavController, navParams: NavParams, public authData: AuthData,
      public af: AngularFire, private userService: UserService, private translate: TranslateService,
      private alertCtrl: AlertController, private appCtrl: App, private notifications: NotificationsService) {

    this.key = navParams.get('key');

    translate.get('ACTIVITY_DETAIL_LOGIN_TO_SUBSCRIBE').subscribe(
      value => { this.loginToSubscribe = value })

    translate.get('ACTIVITY_DETAIL_LOGIN_CREATE_USER').subscribe(
      value => { this.loginCreateUser = value })

    this.activityObs = af.database.object('/activities/' + this.key);
    this.participantsObs = af.database.list('/activities/'+ this.key + '/participants');
    this.interestedInObs = af.database.list('/activities/'+ this.key  + '/interestedIn');
    this.signupNotesObs = af.database.object('/settings/signupNotes/');

    this.signupNotesObs.subscribe(notes => {
      this.signupNotes = notes;
    });

    this.activityObs.subscribe(activity => {
      if (activity.$exists()) this.activity = activity;
    })
    
    userService.users.subscribe(users => {
      this.users = users;

      this.participantsObs.subscribe(participants => {
        this.participants = participants;
        this.participantNames = this.participants.map(participant => this.getUsername(participant.uid))
      });

      this.interestedInObs.subscribe(interestedIn => {
        this.interestedIn = interestedIn;
      });

    });

    translate.get('ACTIVITY_DETAIL_MAX_AMOUNT_OF_PARTICIPANTS_EXCEEDED').subscribe(
      value => { this.maxAmountOfParticipantsExceeded = value })

    translate.get('ACTIVITY_DETAIL_MAX_AMOUNT_OF_PARTICIPANTS_EXCEEDED_MAX').subscribe(
      value => { this.maxAmountOfParticipantsExceededMax= value })

    translate.get('ACTIVITY_DETAIL_MAX_AMOUNT_OF_PARTICIPANTS_EXCEEDED_PARTICIPANTS').subscribe(
      value => { this.maxAmountOfParticipantsExceededParticipants = value })
      
    translate.get('ACTIVITY_DETAIL_TOO_LATE_TO_UNSUBSCRIBE').subscribe(
      value => { this.tooLateToUnsubscribe = value })

  }

  isThisUser(username) {
    if (!this.authData.fireAuth) return false;
    return username === this.userService.getUsername(this.authData.fireAuth.uid, this.users)
  }

  isSignedUp(){
    if (!this.authData.fireAuth) return false;
    return this.isUIDAlreadyInList(this.authData.fireAuth.uid, this.participants);
  }

  isInterestedIn(){
    if (!this.authData.fireAuth) return false;
    return this.isUIDAlreadyInList(this.authData.fireAuth.uid, this.interestedIn);
  }

  returnToLogin(){
    this.appCtrl.getRootNav().popToRoot();
    this.appCtrl.getRootNav().push(LoginPage);
  }

  signup(){
    if (!this.authData.fireAuth) {
      let alert = this.alertCtrl.create({
          message: this.loginToSubscribe,
          buttons: [{ text: "Ok", role: 'cancel' }, { text: this.loginCreateUser, handler: () => this.returnToLogin() } ]
      });
      alert.present();
      return;
    }

    // checking if activity still exists
    firebase.database().ref('/activities/').child(this.key).once('value', (snapshot) => {
      if (snapshot.exists()) {
        if(!this.isSignedUp())
        {
          // check if activity has room for more participants
          if(this.participants && this.activity.maxAmountOfParticipants != null && this.participants.length >= this.activity.maxAmountOfParticipants) {

            let alert = this.alertCtrl.create({
                message: this.maxAmountOfParticipantsExceeded + ' (' + this.maxAmountOfParticipantsExceededMax + ' ' + this.activity.maxAmountOfParticipants + ' ' + this.maxAmountOfParticipantsExceededParticipants + ')',
                buttons: [{ text: "Ok", role: 'cancel' } ]
            });
            alert.present();
            return;
          }

          this.participantsObs.push({uid: this.authData.fireAuth.uid, confirmed: false}).then(() => {

            // schedule locale notification
            this.notifications.createNotification(this.activity);
            
            // show subscription note
            let alert = this.alertCtrl.create({
                message: this.signupNotes[this.activity.category][this.translate.currentLang],
                buttons: [{ text: "Ok", role: 'cancel' } ]
            });
            alert.present();


          });
        }
        else
        {
          var mmt = moment();
          var mmtMidnight = mmt.clone().startOf('day');
          var currentTimeInMinutes = mmt.diff(mmtMidnight, 'minutes');

          // dont allow user to unsubscribe if signup is binding and less than one hour before start
          if(moment(this.activity.date).isBefore(moment().format('YYYY-MM-DD')) || (moment(this.activity.date).isSame(moment().format('YYYY-MM-DD')) && this.activity.startTimeInMinutes - currentTimeInMinutes < 60) && this.activity.category === "binding") {
            let alert = this.alertCtrl.create({
                message: this.tooLateToUnsubscribe,
                buttons: [{ text: "Ok", role: 'cancel' } ]
            });
            alert.present();
            return;
          }
          // remove scheduled locale notification
          this.notifications.deleteNotification(this.activity);
          
          var key = this.participants.find(user => this.authData.fireAuth.uid === user.uid).$key;
          this.participantsObs.remove(key).then(_ => console.log("item deleted"));
        }
      }
    });
  }

  interested(){
    if (!this.authData.fireAuth) {
      let alert = this.alertCtrl.create({
          message: this.loginToSubscribe,
          buttons: [{ text: "Ok", role: 'cancel' }, { text: this.loginCreateUser, handler: () => this.returnToLogin() } ]
      });
      alert.present();
      return;
    }

    // checking if activity still exists
    firebase.database().ref('/activities/').child(this.key).once('value', (snapshot) => {
      if (snapshot.exists()) {
        if(!this.isInterestedIn())
        {
          this.interestedInObs.push({ uid: this.authData.fireAuth.uid });
        }
        else
        {
          var key = this.interestedIn.find(user => this.authData.fireAuth.uid === user.uid).$key;
          this.interestedInObs.remove(key).then(_ => console.log("item deleted"));
        } 
      }
    });
  }

  getUsername(uid:number){
    if (this.userService.getUsername(uid, this.users) !== ""){
      return this.userService.getUsername(uid, this.users);
    }
    // if we didnt find a user we just return the value which should be the username
    return uid;
  }

  isUIDAlreadyInList(uid:string, list: any[]){

    if (!list){
      return false;
    }

    if (list.find(user => uid === user.uid) !== undefined)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}
