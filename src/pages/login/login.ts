import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
import {firebaseConfig} from '../../app/app.module'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;

  constructor(public navCtrl: NavController, public alertCtrl:AlertController /*, public navParams: NavParams*/) {
    firebase.initializeApp(firebaseConfig);
  }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log('ionViewDidLoad LoginPage');
  }

  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
  
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).

        let prompt = this.alertCtrl.create({
          title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            { text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            { text: 'Send',
              handler: data => {
                // Here we need to handle the confirmation code

                confirmationResult.confirm(data.confirmationCode)
                .then(function (result) {
                  // User signed in successfully.
                  console.log(result.user);
                  console.log("Signin Successful");
                  // ...
                }).catch(function (error) {
                  // User couldn't sign in (bad verification code?)
                  // ...
                  console.log("Signin Failed");
                  firebase.
                });
              }
            }
          ]
        });

        prompt.present();
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
  }

}
