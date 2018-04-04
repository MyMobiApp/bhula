import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CReminderJSON } from '../../reminder-interfaces';
import { ReminderProvider } from '../../providers/reminder/reminder';

import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

@Component({
  selector: 'page-triggers',
  templateUrl: 'triggers.html'
})
export class TriggersPage {
  loading: boolean ;
  searchTerm: string = "";
  bInternetConnected: boolean = true;

  sentList: CReminderJSON[] = [];

  constructor(public navCtrl: NavController,
              private reminder: ReminderProvider,
              private singletonService: SingletonServiceProvider,
              private firestoreDBService: FirestoreDBServiceProvider) {
    let _me_ = this ;

    _me_.reminder.initFirestoreAndSingleton(firestoreDBService, singletonService);
    
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
}
