import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Sim} from '@ionic-native/sim';

import * as firebase from 'firebase';

import {TabsPage} from '../tabs/tabs';

import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';

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
  providers: [Sim, SingletonServiceProvider]
})
export class LoginPage {
  countryCode:string = "91";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private objSim: Sim,
    public singletonService:SingletonServiceProvider) {
  }

  ionViewDidLoad() {
    this.objSim.hasReadPermission().then(
      (info) => console.log('Has permission: ', info)
    );
    console.log('ionViewDidLoad LoginPage');
  }

  onLoginSuccess(phoneNumberStr: string) {
    this.navCtrl.setRoot(TabsPage);

    alert("Login Success: I am page and I got called. Your number - " + phoneNumberStr);
    console.log("Login Success: I am page and I got called. Your number - " + phoneNumberStr);
  }

  storeLoginInfoInDB() {

  }

  storeLoginInfoInLocalStorage() {
    
  }
}
