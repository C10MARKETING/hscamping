import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class AuthData {

  fireAuth: any;
  credential: any;

  constructor(public af: AngularFire) {
    af.auth.subscribe( user => {
      if (user) {
        this.fireAuth = user.auth;
      }
    })
  }

  loginUser(newEmail: string, newPassword: string):any {
    return this.af.auth.login({ email: newEmail, password: newPassword });
  }

  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): any {
    this.fireAuth = null;
    return this.af.auth.logout();
  }

  signupUser(newEmail: string, newPassword: string): any {
    return this.af.auth.createUser({email: newEmail, password: newPassword});
  }

  reauthenticate(currentPassword: string){
    this.credential = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email, 
        currentPassword
    );

    return firebase.auth().currentUser.reauthenticate(this.credential);
  }

  updateEmail(email: string) {
    return firebase.auth().currentUser.updateEmail(email).then(function() {
      console.log("user email updated: " + email);
    }, function(error) {
      console.log(error);
    });
  }

  updatePassword(newPassword: string) {

    return firebase.auth().currentUser.updatePassword(newPassword).then(function() {
      console.log("password updated");
    }, function(error) {
      console.log(error);
    });
  }

}
