import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { CReminderJSON } from '../../reminder-interfaces';
import { ReminderProvider } from '../../providers/reminder/reminder';

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

  constructor(public navCtrl: NavController, 
    private reminder: ReminderProvider,
    private singletonService: SingletonServiceProvider,
    private firestoreDBService: FirestoreDBServiceProvider) {
      let _me_ = this ;

      _me_.reminder.initFirestoreAndSingleton(firestoreDBService, singletonService);

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
}
