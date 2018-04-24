import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { IReminderJSON, CReminderJSON, ReminderStatus } from '../../reminder-interfaces';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { ReminderServiceProvider } from '../../providers/reminder-service/reminder-service';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import { CirclesProvider } from '../../providers/circles/circles';

/**
 * Generated class for the ReminderPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reminder-popover',
  templateUrl: 'reminder-popover.html',
})
export class ReminderPopoverPage {
  phoneNumber: string = "";
  title: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController, 
              public singletonService: SingletonServiceProvider,
              public reminderService: ReminderServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public notificationService: NotificationServiceProvider,
              public circles: CirclesProvider) {
    this.phoneNumber = navParams.get("phoneNumber");

    this.reminderService.initProviders(firestoreDBService, singletonService, notificationService);

    let title = navParams.get("title");
    this.title = title ? title : "Reminder Options"; 
    //alert(this.phoneNumber);
  }

  ionViewDidLoad() {
    
  }

  onSetReminder(data: IReminderJSON) {
    //alert("For : "+this.phoneNumber+" - "+JSON.stringify(data));
    
    let reminder = new CReminderJSON();
    reminder.setObj(data);

    let _me_ = this;
    let sentList = [];

    let pos = _me_.circles.normilizedCircleList.findIndex(iter => iter.phoneNumber === _me_.phoneNumber);
    
    if(pos != -1) {
      reminder.phoneNumber = _me_.circles.normilizedCircleList[pos].phoneNumber;
      reminder.displayName = _me_.circles.normilizedCircleList[pos].displayName;
      reminder.status      = ReminderStatus.ReceivedOrSent;
    }

    _me_.reminderService.updateReceivedListFor(_me_.phoneNumber, reminder);
    
    sentList.push(reminder.toJSON());
    _me_.reminderService.updateSentListForMe(sentList);
    
    _me_.navCtrl.pop();
  }
}
