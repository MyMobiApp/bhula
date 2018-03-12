import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Validators } from '@angular/forms';
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

  loginEnabled: boolean = false;
  phoneNumber: string;
  isdCode: string;

  private coumtryCodeArray:any = [];
  private timeoutDurationInSec: number = 60; // In seconds
  private recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  private phoneAuthProvider:firebase.auth.PhoneAuthProvider;
  
  constructor(public alertCtrl:AlertController, 
    public navParams: NavParams,
    public navCtrl: NavController,
    private platform:Platform,
    private firebasePlugin: Firebase) {
      this.coumtryCodeArray = (<any>countryCodeObj).countries;

      this.coumtryCodeArray.sort((cur, next) => (<string>cur.name) < (<string>next.name) ? -1 : (<string>cur.name) > (<string>next.name) ? 1 : 0);
  }

  ngOnInit () {
    this.phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    
    //this.loginSuccessCallback.emit("+919039579039");
    
    let country = this.coumtryCodeArray.find((obj) => {
      return <string>obj.code == this.countryCode; 
    });
    
    this.isdCode      = <any>country.dial_code;
    this.countryCode  = <any>country.dial_code;
  }

  verifyPhoneNumberPromiseCore(phoneNumberString, confirmationResult) {
    let objThis = this;
    
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
              objThis.loginSuccessCallback.emit(phoneNumberString);
              console.log(result.user);
              console.log("Signin Successful via Core");
            }).catch(function (error) {
              console.log(error);
            });
          }
        }
      ]
    });

    prompt.present();
  }
  
  verifyPhoneNumberPromiseAndroid(phoneNumberString, verificationId) {
    let objThis = this;

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
              objThis.loginSuccessCallback.emit(phoneNumberString);
              alert("Sign-in Successful via Android");
              console.log(info);
            }, (error) => {
              alert("Sign-in Error: "+error);
            });
          }
        }
      ]
    });

    prompt.present();
  }

  signIn(phoneNumber: string){
    let thisObj = this;

    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = phoneNumber;

    if(this.platform.is('android')) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function() {
        let confResult;

        thisObj.firebasePlugin.verifyPhoneNumber(phoneNumberString, thisObj.timeoutDurationInSec).then( confirmationResult => {
          confResult = confirmationResult;

          thisObj.verifyPhoneNumberPromiseAndroid(phoneNumberString, confirmationResult.verificationId);
        }).catch(function (error) {
          alert("SMS not sent error: "+error);
        });

        return confResult;
      })
      .catch(function(error) {
        console.log(error.code + " : " + error.message);
      });
      
    }
    else if(this.platform.is('core'))
    {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function() {
        let confResult;

        firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier).then( confirmationResult => {
          confResult = confirmationResult;

          thisObj.verifyPhoneNumberPromiseCore(phoneNumberString, confirmationResult);
        }).catch(function (error) {
          console.error("SMS not sent: ", error);
        });

        return confResult;
      })
      .catch(function(error) {
        console.log(error.code + " : " + error.message);
      });

      
    }
  }

  onISDCodeChange(isdCode: string) {
    let ph = this.phoneNumber.substr(this.isdCode.length);
    
    this.isdCode = isdCode;
    this.phoneNumber = this.countryCode + ph;
  }

  onTermsAgreed() {
    this.loginEnabled = this.loginEnabled ?  false : true;
  }

  onPhoneNumberChange(phoneNumber:string) {
    let ph = phoneNumber;
    
    if(phoneNumber.substr(0,1) == "+") {
      ph = phoneNumber.substr(this.countryCode.length);
    }

    this.phoneNumber = this.countryCode + ph;
  }
}
