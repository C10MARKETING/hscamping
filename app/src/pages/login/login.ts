import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';

import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

import { EmailValidator } from '../../validators/email';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  tabsPage = TabsPage;

  loginForm: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;
  loginError: string = '';

  constructor(public navCtrl: NavController, public authData: AuthData, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
  translate: TranslateService) {

    translate.get('LOGIN_ERROR').subscribe(
      value => { this.loginError = value })

    this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, 
            EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), 
        Validators.required])]
    });

  }

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }

  createAccount(){
    this.navCtrl.push(SignupPage);
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  logInAnonymously(){
    this.navCtrl.setRoot(this.tabsPage);
  }

  loginUser(){
      this.submitAttempt = true;

      if (!this.loginForm.valid) {
        console.log(this.loginForm.value);
      } else {
        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
          this.loading.dismiss().then ( () => {
            this.navCtrl.setRoot(TabsPage);
          })
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: this.loginError, buttons: [{ text: "Ok", role: 'cancel' }]
            });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({});
        this.loading.present();
      }
  }

}
