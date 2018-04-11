import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SMS } from '@ionic-native/SMS';

import { CReminderJSON, ReminderStatus } from '../../reminder-interfaces';
import { ReminderServiceProvider } from '../../providers/reminder-service/reminder-service';
import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

@Component({
  selector: 'page-triggers',
  templateUrl: 'triggers.html',
  providers: [SMS]
})
export class TriggersPage {
  loading: boolean ;
  searchTerm: string = "";
  bInternetConnected: boolean = true;

  sentList: CReminderJSON[] = [];

  reminderIcon: any = "assets/icon/alarm-icon-notification.ico";

  constructor(public navCtrl: NavController,
              private sms: SMS,
              private reminder: ReminderServiceProvider,
              private singletonService: SingletonServiceProvider,
              private firestoreDBService: FirestoreDBServiceProvider,
              private notificationService: NotificationServiceProvider) {
    let _me_ = this ;

    _me_.reminder.initProviders(firestoreDBService, singletonService, notificationService);
    
    if(_me_.reminder.sentList.length == 0) {
      _me_.loading = true;
    }else {
      _me_.sentList = _me_.reminder.getSentList();
    }
    
    reminder.loadReminders().then( () => {
      _me_.sentList = reminder.sentList ;
      
      _me_.loading = false;
    }).catch((error) => {
      _me_.loading = false;

      console.log(error);
    });

    this.reminder.sentSubscriber.subscribe((sentReminder) => {
      _me_.sentList = sentReminder;
    });
  }

  filterTriggers(){
    let _me_ = this;

    _me_.sentList = _me_.reminder.filterRemindersReceived(_me_.searchTerm);
  }

  refreshTriggers(refresher) {
    let _me_ = this;
    _me_.bInternetConnected = _me_.firestoreDBService.bInternetConnected;

    if(_me_.bInternetConnected) {
      _me_.reminder.loadReminders().then(() => {
        _me_.sentList = _me_.reminder.sentList;
  
        refresher.complete();
      }).catch((error) => {
        console.log(error);
  
        refresher.complete();
      });
    } else {
      refresher.complete();
    }
  }

  onCancel(phoneNumber: string) {
    let _me_ = this;
    
    _me_.reminder.changeSentStatus(phoneNumber, ReminderStatus.CanceledBySender);
  }

  onSMS(phoneNumber: string) {
    let _me_ = this;
    
    let options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
           intent: 'INTENT'  // Opens Default sms app
          //intent: '' // Sends sms without opening default sms app
        }
    };

    let pos = _me_.sentList.findIndex(iter => iter.phoneNumber === phoneNumber);
    let smsMsg = _me_.sentList[pos].title + "\n" + _me_.sentList[pos].description + "\n at " + _me_.sentList[pos].date + " - " + _me_.sentList[pos].time;

    _me_.sms.send(phoneNumber, smsMsg, options).then (()=>{
      //alert("Invitation is sent to < "+ phoneNumber + " >");
    },(err)=> {
      alert("Error : " + err);
    });
  }
}
