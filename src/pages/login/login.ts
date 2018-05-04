import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

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
  templateUrl: 'login.html'
})
export class LoginPage {
  countryCode:string = "US";
  currentYear:number = (new Date()).getFullYear();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public singletonService:SingletonServiceProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onLoginSuccess(phoneNumberStr: string) {
    this.singletonService.loginState = true;
    console.log("Login Success: I am page and I got called. Your number - " + phoneNumberStr);

    this.navCtrl.setRoot(TabsPage);
  }

}
