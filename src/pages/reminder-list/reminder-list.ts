import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { CReminderJSON, ReminderStatus } from '../../reminder-interfaces';
import { ReminderServiceProvider } from '../../providers/reminder-service/reminder-service';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

@Component({
  selector: 'page-reminder-list',
  templateUrl: 'reminder-list.html'
})
export class ReminderListPage {
  loading: boolean ;
  searchTerm: string = "";
  bInternetConnected: boolean = true;

  receivedList: CReminderJSON[] = [];

  alarmIcon: any = "assets/icon/alarm-bell-icon.ico";

  constructor(public navCtrl: NavController, 
    private reminder: ReminderServiceProvider,
    private singletonService: SingletonServiceProvider,
    private firestoreDBService: FirestoreDBServiceProvider,
    private notificationService: NotificationServiceProvider) {
      let _me_ = this ;

      _me_.reminder.initProviders(firestoreDBService, singletonService, notificationService);

      if(_me_.reminder.receivedList.length == 0) {
        _me_.loading = true;
      }else {
        _me_.receivedList = _me_.reminder.getRecdList();
      }
      
      reminder.loadReminders().then( () => {
        _me_.receivedList = reminder.receivedList ;
        _me_.loading = false;
      }).catch((error) => {
        _me_.loading = false;

        console.log(error);
      });

      this.reminder.receivedSubscriber.subscribe((recdReminder) => {
        _me_.receivedList = recdReminder;
      });
  }

  filterReminders(){
    let _me_ = this;

    _me_.receivedList = _me_.reminder.filterRemindersReceived(_me_.searchTerm);
  }

  refreshReminders(refresher) {
    let _me_ = this;
    _me_.bInternetConnected = _me_.firestoreDBService.bInternetConnected;

    if(_me_.bInternetConnected) {
      _me_.reminder.loadReminders().then((list) => {
        _me_.receivedList = _me_.reminder.receivedList;
  
        refresher.complete();
      }).catch((error) => {
        console.log(error);
  
        refresher.complete();
      });
    } else {
      refresher.complete();
    }
  }

  onAccept(phoneNumber: string) {
    let _me_ = this;
    //alert("onAccept");
    _me_.reminder.changeReceivedStatus(phoneNumber, ReminderStatus.Accepted);
  }
  
  onIgnore(phoneNumber: string) {
    let _me_ = this;
    //alert("onIgnore");
    _me_.reminder.changeSentStatus(phoneNumber, ReminderStatus.IgnoredByReceiver);
  }
  
}
