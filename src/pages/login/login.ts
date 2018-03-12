import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';

import * as firebase from 'firebase';

import {TabsPage} from '../tabs/tabs';

import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

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
  providers: [Sim]
})
export class LoginPage {
  countryCode:string = "IN";
  currentYear:number = (new Date()).getFullYear();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private objSim: Sim,
    public singletonService:SingletonServiceProvider) {
  }

  ionViewDidLoad() {
    this.objSim.hasReadPermission().then( (info) => {
      console.log('Has permission: ', info);
      this.singletonService.simInfo = info;
      this.countryCode = info.countryCode;
    });
    
    console.log('ionViewDidLoad LoginPage');
  }

  onLoginSuccess(phoneNumberStr: string) {
    this.singletonService.loginState = true;
    console.log("Login Success: I am page and I got called. Your number - " + phoneNumberStr);

    this.navCtrl.setRoot(TabsPage);
  }

}
