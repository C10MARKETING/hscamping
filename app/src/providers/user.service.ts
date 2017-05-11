import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class UserService {

  users: FirebaseListObservable<any[]>;

  currentUsers: any[];

  constructor(public af: AngularFire) {
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

  updateUserInfo(uid:number, name:string, email:string, guestOn:string){
    firebase.database().ref('users/' + uid).set({
      name: name,
      email: email,
      guestOn: guestOn
    });
  }

}
