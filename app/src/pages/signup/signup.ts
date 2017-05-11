import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { TabsPage } from '../tabs/tabs';
import * as firebase from 'firebase';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {

    tabsPage = TabsPage;
    public signupForm;
    emailChanged: boolean = false;
    passwordChanged: boolean = false;
    submitAttempt: boolean = false;
    currentGuestOn: string = 'camping';
    loading;
    signupError: string = "";

    constructor(public navCtrl: NavController, public authData: AuthData, public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, translate: TranslateService) {

    translate.get('SIGNUP_ERROR').subscribe(
      value => { this.signupError = value })

        this.signupForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, 
            EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), 
            Validators.required])],
            name: ['', Validators.compose([Validators.minLength(2), 
            Validators.required])],
            guestOn: ['', Validators.required]
        });

    }

    /**
    * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
    */
    elementChanged(input){
        let field = input.inputControl.name;
        this[field + "Changed"] = true;
    }

    /**
    * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
    * component while the user waits.
    *
    * If the form is invalid it will just log the form value, feel free to handle that as you like.
    */
    signupUser(){
        this.submitAttempt = true;

        if (!this.signupForm.valid){
            console.log(this.signupForm.value);
        } else {
            this.authData.signupUser(this.signupForm.value.email, 
                this.signupForm.value.password).then(() => {
                this.writeUserData(this.authData.fireAuth.uid, this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.guestOn);
                this.loading.dismiss().then ( () => {
                    this.navCtrl.setRoot(TabsPage);
                    console.log(this.authData.fireAuth.email);
                })
                }, (error) => {
                    this.loading.dismiss().then( () => {
                        let alert = this.alertCtrl.create({
                            message: this.signupError,
                            buttons: [{ text: "Ok", role: 'cancel' } ]
                        });

                        alert.present();
                    });
                });

            this.loading = this.loadingCtrl.create({});

            this.loading.present();
        }
    }

    writeUserData(userID, name, email, guestOn){
        firebase.database().ref('users/' + userID).set({
            name: name,
            email: email,
            guestOn: guestOn
        });
    }

    goBack() {
        this.navCtrl.pop();
    }

}
