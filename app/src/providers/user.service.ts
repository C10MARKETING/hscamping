import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';

@Injectable()
export class UserService {

  users: FirebaseListObservable<any[]>;

  currentUsers: any[];

  constructor(public af: AngularFire, private translate: TranslateService) {
    this.users = af.database.list('/users');
    this.users.subscribe(users => {
      this.currentUsers = users;
    });
  }

  getUsername(uid:number, users:any[]){
    if (!users) return;
    if (users.find(user => uid === user.$key) === undefined)
      return "";
    else
      return users.find(user => uid === user.$key).name;
  }

  getGuestOn(uid:number, users:any[]) {
    if (!users) return;
    if (users.find(user => uid === user.$key) === undefined)
      return "Unknown user";
    else
      return users.find(user => uid === user.$key).guestOn;
  }

  getLanguage(uid:number, users:any[]) {
    if (!users) return;
    if (users.find(user => uid === user.$key) === undefined)
      return "da";
    else {
      let lang = users.find(user => uid === user.$key).language;
      if (lang === undefined) return 'da';
      return lang;
    }

  }

  updateUserInfo(uid:number, name:string, email:string, guestOn:string, language:string){
    firebase.database().ref('users/' + uid).set({
      name: name,
      email: email,
      guestOn: guestOn,
      language: language
    });

    this.translate.use(language);
  }

}
