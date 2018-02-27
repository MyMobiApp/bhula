import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import {firebaseConfig} from '../../app/app.module';

/**
 * Generated class for the PhoneLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'phone-login',
  templateUrl: 'phone-login.html'
})
export class PhoneLoginComponent {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  
  constructor(public alertCtrl:AlertController) {
    firebase.initializeApp(firebaseConfig);

    console.log('Hello PhoneLoginComponent Component');
  }

  ngOnInit () {
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
                  this.navCtrl.pop();
                  // ...
                }).catch(function (error) {
                  // User couldn't sign in (bad verification code?)
                  // ...
                  //(<any>window).FirebaseCrashReport.log("Signin Failed");
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
