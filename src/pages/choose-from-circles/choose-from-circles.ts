import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IWeeklyFrequency, IReminderJSON, CWeeklyFrequency, CReminderJSON } from '../../reminder-interfaces';
import { CContactJSON } from '../../contact-interfaces';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';
import { CirclesProvider } from '../../providers/circles/circles';

/**
 * Generated class for the ChooseFromCirclesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-from-circles',
  templateUrl: 'choose-from-circles.html',
})
export class ChooseFromCirclesPage {
  reminder: CReminderJSON  = new CReminderJSON();

  loading: boolean ;
  selectCount: number = 0;
  bInternetConnected: boolean = true;
  searchTerm: string = "";
  selectedImg: string = "assets/imgs/selected.png";
  normalizedCircleList: CContactJSON[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public singletonService:SingletonServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public circles: CirclesProvider) {
    this.reminder.setObj(navParams.get('reminder'));
    
    //alert(JSON.stringify( this.reminder.toJSON() ));

    this.circles.initPhoneContactsAndDB (phoneContacts, firestoreDBService);

    this.normalizedCircleList = <CContactJSON[]>(this.phoneContacts.getUserCirclesCollectionList());

    if(this.normalizedCircleList.length == 0) {
      this.loading = true;
    }
  }

  ionViewDidLoad() {
    let _me_ = this;

    _me_.circles.loadCircle(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
      _me_.loading = false;
      _me_.normalizedCircleList = list;
    }).catch((error) => {
      console.log(error);
    });
  }

  filterCircle(){
    let _me_ = this;

    _me_.loading = true;

    _me_.normalizedCircleList = _me_.circles.filterCircle(_me_.searchTerm);

    _me_.loading = false;
  }

  refreshCircleList(refresher) {
    let _me_ = this;
    _me_.bInternetConnected = _me_.firestoreDBService.bInternetConnected;

    if(_me_.bInternetConnected) {
      _me_.circles.loadCircle(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
        _me_.normalizedCircleList = list;
  
        refresher.complete();
      }).catch((error) => {
        console.log(error);
  
        refresher.complete();
      });
    } else {
      refresher.complete();
    }
  }

  onItemClick(phoneNumber: string) {
    let _me_ = this;

    let pos = _me_.normalizedCircleList.findIndex(iter => iter.phoneNumber === phoneNumber);

    if(pos != -1) {
      _me_.normalizedCircleList[pos].bSelected = _me_.normalizedCircleList[pos].bSelected ? false : true;

      _me_.selectCount = 0;
      _me_.normalizedCircleList.forEach((obj, pos, ary) => {
        if(obj.bSelected) {
          _me_.selectCount++;
        }
      });
    }
  }

  setReminder() {
    let _me_ = this;
    let sentList = [];

    _me_.navCtrl.remove(2, 1);

    _me_.normalizedCircleList.forEach((obj, pos, ary) => {
      if(obj.bSelected) {
        _me_.updateReceivedListFor(obj.phoneNumber);

        _me_.reminder.phoneNumber = obj.phoneNumber;
        _me_.reminder.displayName = obj.displayName;
        
        sentList.push(_me_.reminder.toJSON());

        obj.bSelected = false;
      }
    });

    _me_.updateSentListForMe(sentList);
    
    _me_.navCtrl.pop();
  }

  updateReceivedListFor(phoneNumber: string) {
    let _me_ = this;

    _me_.firestoreDBService.getDocumentWithID("UserReminders", phoneNumber).then( (uReminders) => {
      if(uReminders != null ) {
        let receivedList = uReminders.received ? uReminders.received : [];

        _me_.reminder.phoneNumber = _me_.singletonService.userAuthInfo.phoneNumber;
        receivedList.push( _me_.reminder.toJSON() );
        
        _me_.firestoreDBService.updateDocument("UserReminders", phoneNumber, {'received': receivedList}).then(data => {
          // Document updated
          alert("Reminder has set for < " + phoneNumber + " >");
        }, error => {
          alert(error)
        }).catch( (excp) => {
          alert(excp);
        });
      } else {
        let receivedList = [];

        receivedList.push( _me_.reminder.toJSON() );
        
        _me_.firestoreDBService.addDocument("UserReminders", phoneNumber, {'received': receivedList}).then(data => {
          // Document added
          alert("Reminder has set for < " + phoneNumber + " >");
        }, error => {
          alert(error)
        }).catch( (excp) => {
          alert(excp);
        });
      }
    }).catch( (error) => {
      alert(error);
    });
    
  }

  updateSentListForMe(sentList: any) {
    let _me_ = this;

    _me_.firestoreDBService.getDocumentWithID("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber).then( (uReminders) => {
      if(uReminders != null) {
        let dbSentList = uReminders.sent ? uReminders.sent.concat(sentList) : [];

        _me_.firestoreDBService.updateDocument("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber, {'sent': dbSentList}).then(data => {
          // Document updated
        }, error => {
          alert(error)
        }).catch( (excp) => {
          alert(excp);
        });
      } else {
        _me_.firestoreDBService.addDocument("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber, {'sent': sentList}).then(data => {
          // Document updated
        }, error => {
          alert(error)
        }).catch( (excp) => {
          alert(excp);
        });
      }
    }).catch( (error) => {
      alert(error);
    });
  }
}
