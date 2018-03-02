import { Component } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';

import * as firebase from 'firebase';

import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';


/**
 * Generated class for the PhoneLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'phone-login',
  templateUrl: 'phone-login.html',
  providers: [SingletonServiceProvider]
})
export class PhoneLoginComponent {
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  public phoneAuthProvider:firebase.auth.PhoneAuthProvider;
  
  constructor(public alertCtrl:AlertController, 
    public singletonService:SingletonServiceProvider,
    public platform:Platform) {
    console.log('Hello PhoneLoginComponent Component');
  }

  ngOnInit () {
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
    
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    
    console.log('ionViewDidLoad LoginPage');
  }

  verifyPhoneNumberPromise(confirmationResult) {
    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    let alert = this.alertCtrl.create({
      title: 'In Promise',
      subTitle: 'In verify phone number promise',
      buttons: ['Dismiss']
    });
    alert.present();

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
              this.singletonService.loginState = true;
              console.log(result.user);
              console.log("Signin Successful");
              // ...
            }).catch(function (error) {
              // User couldn't sign in (bad verification code?)
              // ...
              this.singletonService.loginState = false;
              //(<any>window).FirebaseCrashReport.log("Signin Failed");
            });
          }
        }
      ]
    });

    prompt.present();
  }
  
  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
  
    if(this.platform.is('android')) {
      let alert = this.alertCtrl.create({
        title: 'In Android',
        subTitle: 'Going for android flow.',
        buttons: ['Dismiss']
      });
      alert.present();

      this.phoneAuthProvider.verifyPhoneNumber(phoneNumberString, appVerifier).then( confirmationResult => {
        this.verifyPhoneNumberPromise(confirmationResult);
      }).catch(function (error) {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error,
          buttons: ['Dismiss']
        });
        alert.present();

        console.error("SMS not sent", error);
      });
    }
    else if(this.platform.is('core'))
    {
      let alert = this.alertCtrl.create({
        title: 'In Core',
        subTitle: 'Going for core flow.',
        buttons: ['Dismiss']
      });
      alert.present();

      firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier).then( confirmationResult => {
        this.verifyPhoneNumberPromise(confirmationResult);
      }).catch(function (error) {
        console.error("SMS not sent", error);
      });
    } 
  }

}
