import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

  resetPasswordForm: any;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  linkSent: string = "";
  emailNotFound: string = "";

  constructor(public authData: AuthData, public formBuilder: FormBuilder, public navCtrl: NavController, public alertCtrl: AlertController,
  translate: TranslateService) {

      translate.get('RESETPASSWORD_LINK_SENT').subscribe(
        value => { this.linkSent = value });

      translate.get('RESETPASSWORD_EMAIL_NOT_FOUND').subscribe(
        value => { this.emailNotFound = value })

      this.resetPasswordForm = formBuilder.group({
          email: ['', Validators.compose([Validators.required,
              EmailValidator.isValid])]
      })

  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  resetPassword(){
    this.submitAttempt = true;

    if (!this.resetPasswordForm.valid){
        console.log(this.resetPasswordForm.value);
    } else {
        this.authData.resetPassword(this.resetPasswordForm.value.email)
        .then((user) => {
            let alert = this.alertCtrl.create({
                message: this.linkSent,
                buttons: [{ text: "Ok", role: 'cancel',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }]
            });
        alert.present();
        }, (error) => {
            let errorAlert = this.alertCtrl.create({
                message: this.emailNotFound,
                buttons: [{ text: "Ok", role: 'cancel' }]
            });

            errorAlert.present();
        });
    }
  }

    goBack() {
        this.navCtrl.pop();
    }

}
