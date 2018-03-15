import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ChooseFromCirclesPage } from '../choose-from-circles/choose-from-circles';
/**
 * Generated class for the ReminderContainerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reminder-container',
  templateUrl: 'reminder-container.html',
})
export class ReminderContainerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReminderContainerPage');
  }

  onNext(data: any) {
    alert(data);

    this.navCtrl.push(ChooseFromCirclesPage);
  }

}
