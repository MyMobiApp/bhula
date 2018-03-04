import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, Platform, NavParams, NavController } from 'ionic-angular';
import {Firebase} from '@ionic-native/firebase';

import * as firebase from 'firebase';
import * as countryCodeObj from './country-codes.json';

//import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';

/**
 * Generated class for the PhoneLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'phone-login',
  templateUrl: 'phone-login.html',
  providers: [Firebase]
})
export class PhoneLoginComponent {
  @Input() 
  countryCode:string;
  @Output() 
  loginSuccessCallback: EventEmitter<string> = new EventEmitter<string>();

  private coumtryCodeArray:any;
  private timeoutDurationInSec: number = 60; // In seconds
  private recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  private phoneAuthProvider:firebase.auth.PhoneAuthProvider;
  
  constructor(public alertCtrl:AlertController, 
    public navParams: NavParams,
    public navCtrl: NavController,
    private platform:Platform,
    private firebasePlugin: Firebase) {
      console.log(countryCodeObj.default.countries);
      this.coumtryCodeArray = countryCodeObj.default.countries;
  }

  ngOnInit () {
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    console.log("ngOnInit PhoneLoginComponent: "+this.countryCode);
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
              console.log(result.user);
              console.log("Signin Successful");
              this.loginSuccessCallback.emit(phoneNumberString);
            }).catch(function (error) {
              //this.singletonService.loginState = false;
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
              alert("Sign-in Successful");
              this.loginSuccessCallback.emit(phoneNumberString);
              console.log(info);
            }, (error) => {
              //this.singletonService.loginState = false;
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
        this.loginSuccessCallback.emit(phoneNumberString);
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
