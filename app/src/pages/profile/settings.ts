import { Component } from '@angular/core';
import { App, ToastController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { UserService } from '../../providers/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public settingsForm;
  users: any[];

  usernameChanged: boolean = false;
  emailChanged: boolean = false;
  newPasswordChanged: boolean = false;
  currentPasswordChanged: boolean = false;
  submitAttempt: boolean = false;

  currentUsername: string;
  currentEmail: string;
  currentGuestOn: string;
  currentPrefLang: string;
  currentNewPassword: string = "";
  currentCurrentPassword: string = "";
  settingsUpdated: string = "";

  constructor(public authData: AuthData, public formBuilder: FormBuilder, private userService: UserService, private appCtrl: App,
      private toastCtrl: ToastController, private translate: TranslateService) {

    translate.get('SETTINGS_SETTINGS_UPDATED').subscribe(
      value => { this.settingsUpdated = value })

    this.getUserEmail();

    userService.users.subscribe(users => {
      this.users = users;

      this.getUserInfo();
    });

    this.settingsForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, 
        EmailValidator.isValid])],
        newPassword: ['', Validators.compose([Validators.minLength(6)])],
        username: ['', Validators.compose([Validators.minLength(2), 
        Validators.required])],
        guestOn: ['', Validators.required],
        prefLang: ['', Validators.required],
        currentPassword: ['', Validators.compose([Validators.minLength(6), 
        Validators.required])],
    });

  }

  /**
  * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
  */
  elementChanged(input){
      let field = input.inputControl.name;
      this[field + "Changed"] = true;
  }

  getUserEmail() {
    if (!this.authData.fireAuth) return;
    this.currentEmail = this.authData.fireAuth.email;
  }

  getUserInfo() {
    this.currentUsername = this.userService.getUsername(this.authData.fireAuth.uid, this.users);
    this.currentGuestOn = this.userService.getGuestOn(this.authData.fireAuth.uid, this.users);
    this.currentPrefLang = this.userService.getLanguage(this.authData.fireAuth.uid, this.users);
  }

  updateUserInfo(){
    this.submitAttempt = true;
        if (!this.authData.fireAuth) return;

    if (!this.settingsForm.valid) {
        console.log(this.settingsForm.value);
    }
    else {
      this.authData.reauthenticate(this.currentCurrentPassword).then(() => {
        console.log("re-reauthenticated");
        this.authData.updateEmail(this.currentEmail).then(() => {
          this.userService.updateUserInfo(this.authData.fireAuth.uid, this.currentUsername, this.currentEmail, this.currentGuestOn, this.currentPrefLang);
        });

        if (this.currentNewPassword && this.currentNewPassword != "") {
          this.authData.updatePassword(this.currentNewPassword);
        }
      }, function(error) {
        console.log(error);
      });;

      this.presentToast(this.settingsUpdated, 2000);

    }

  }

  logoutUser(){
    if (!this.authData.fireAuth) {
      this.appCtrl.getRootNav().popToRoot();
      this.appCtrl.getRootNav().push(LoginPage);
    }
    else  {
      this.authData.logoutUser().then(() => {
        this.appCtrl.getRootNav().popToRoot();
        this.appCtrl.getRootNav().push(LoginPage);
      });
    }
  }

  presentToast(message: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

}
