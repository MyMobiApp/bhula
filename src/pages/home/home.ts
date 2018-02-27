import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  verificationID: any;
  code: string = "";

  constructor(public navCtrl: NavController) {
    
  }

  send() {
    /*(<any>window).FirebasePlugin.verifyPhoneNumber("+919039579039", 60, (credential)=> {
      alert("SMS Sent Successfully");
      console.log(credential);

      this.verificationID = credential.verificationID;
    }, (error) => {
      console.error(error);
    });*/
  }

  verify() {
    /*let signinCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationID, this.code);

    firebase.auth().signInWithCredential(signinCredential).then((info)=>{
      console.log(info);
    }, (error) => {
      console.log(error);
    });*/
  }
}
