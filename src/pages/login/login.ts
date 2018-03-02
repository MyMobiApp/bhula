import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase';

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
  providers: [SingletonServiceProvider]
})
export class LoginPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public singletonService:SingletonServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  storeLoginInfoInDB() {

  }

  storeLoginInfoInLocalStorage() {
    
  }
}
