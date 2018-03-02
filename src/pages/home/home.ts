import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import * as firebase from 'firebase';

/*
<string name="fb_app_id">1467456360020322</string>
	<string name="fb_app_name">Yadi App : Social Reminder</string>
	<string name="accountkit_token">12ddd326f018b01c38752fb837d35caf</string>
*/

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  verificationID: any;
  code: string = "";
  userInfo: any = {};

  constructor(public navCtrl: NavController, private alertCtrl:AlertController) {
    
  }

  send() {
    
    cordova.plugins.firebase.auth.verifyPhoneNumber("+123456789").then(function(verificationID) {
      alert("SMS Sent Successfully");
      
      this.verificationID = verificationID;
    }).catch (error => {
      alert(error);
      console.error(error);
    });

    /*
    this.firebasePlugin.verifyPhoneNumber("+919039579039", 60).then (credential=> {
      alert("SMS Sent Successfully");
      console.log(credential);

      this.verificationID = credential.verificationID;
    }).catch (error => {
      console.error(error);
    });
    */
  }

  verify() {
    let signinCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationID, this.code);

    firebase.auth().signInWithCredential(signinCredential).then((info)=>{
      console.log(info);
    }, (error) => {
      let alert = this.alertCtrl.create({
        title: 'Login Error',
        subTitle: error,
        buttons: ['Dismiss']
      });
      alert.present();
      console.log(error);
    });
  }
}
