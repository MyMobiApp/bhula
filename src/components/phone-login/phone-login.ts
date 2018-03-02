import { Component } from '@angular/core';
import { AlertController, Platform, NavParams } from 'ionic-angular';
import {Firebase} from '@ionic-native/firebase';

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
  providers: [SingletonServiceProvider, Firebase]
})
export class PhoneLoginComponent {
  private timeoutDurationInSec: number = 60; // In seconds

  private recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  private phoneAuthProvider:firebase.auth.PhoneAuthProvider;
  
  constructor(public alertCtrl:AlertController, 
    public singletonService:SingletonServiceProvider,
    public navParams: NavParams,
    private platform:Platform,
    private firebasePlugin: Firebase) {
    console.log('Hello PhoneLoginComponent Component');
  }

  ngOnInit () {
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
    
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    
    console.log('ionViewDidLoad LoginPage');
  }

  verifyPhoneNumberPromiseCore(phoneNumberString, confirmationResult) {
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
            confirmationResult.confirm(data.confirmationCode)
            .then(function (result) {
              this.singletonService.loginState = true;
              this.singletonService.loggedInPhoneNumber = phoneNumberString;
              //this.navParams.set
              console.log(result.user);
              console.log("Signin Successful");
            }).catch(function (error) {
              this.singletonService.loginState = false;
            });
          }
        }
      ]
    });

    prompt.present();
  }
  
  verifyPhoneNumberPromiseAndroid(phoneNumberString, verificationId) {
    let prompt = this.alertCtrl.create({
      title: 'Enter the Confirmation code',
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
      buttons: [
        { text: 'Cancel',
          handler: data => { console.log('Cancel clicked'); }
        },
        { text: 'Send',
          handler: data => {
            let signinCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, data.confirmationCode);

            firebase.auth().signInWithCredential(signinCredential).then((info)=>{
              this.singletonService.loginState = false;
              this.singletonService.loggedInPhoneNumber = phoneNumberString;
              
              alert("Sign-in Successful");
              console.log(info);
            }, (error) => {
              this.singletonService.loginState = false;
              alert("Sign-in Error: "+error);
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
      this.firebasePlugin.verifyPhoneNumber(phoneNumberString, this.timeoutDurationInSec).then( confirmationResult => {
        this.verifyPhoneNumberPromiseAndroid(phoneNumberString, confirmationResult.verificationId);
      }).catch(function (error) {
        alert("SMS not sent error: "+error);
      });
    }
    else if(this.platform.is('core'))
    {
      firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier).then( confirmationResult => {
        this.verifyPhoneNumberPromiseCore(phoneNumberString, confirmationResult);
      }).catch(function (error) {
        console.error("SMS not sent: ", error);
      });
    } 
  }

}
