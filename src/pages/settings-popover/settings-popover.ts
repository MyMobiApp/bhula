import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';

/**
 * Generated class for the SettingsPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings-popover',
  templateUrl: 'settings-popover.html',
})
export class SettingsPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public viewCtrl: ViewController, public firebasePlugin: Firebase,
              public singletonService: SingletonServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPopoverPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  logoutUser() {
    firebase.auth().signOut();
    this.firebasePlugin.unsubscribe(this.singletonService.fcmPushTopicAddReminder);

    this.viewCtrl.dismiss();
  }
}
