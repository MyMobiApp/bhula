import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { CReminderJSON, IReminderJSON } from '../../reminder-interfaces';

import { SingletonServiceProvider } from '../singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../firestore-db-service/firestore-db-service';

/*
  Generated class for the ReminderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReminderProvider {
  firestoreDBService: FirestoreDBServiceProvider;
  singletonService: SingletonServiceProvider;

  sentList:     CReminderJSON[] = [];
  receivedList: CReminderJSON[] = [];

  constructor(private storage: Storage) {
    
  }

  initFirestoreAndSingleton(firestoreDBService: FirestoreDBServiceProvider, 
                            singletonService: SingletonServiceProvider) {
    this.firestoreDBService  = firestoreDBService;
    this.singletonService   = singletonService;

    if(this.singletonService.sentList) {
      this.sentList = this.singletonService.sentList.map(x => {
        let obj: CReminderJSON = new CReminderJSON();
        
        obj.setObj(x);
        return obj;
      });
    }

    if(this.singletonService.receivedList > 0) {
      this.receivedList = this.singletonService.receivedList.map(x => {
        let obj: CReminderJSON = new CReminderJSON();
        
        obj.setObj(x);
        
        return obj;
      });
    }
  }

  getSentList() {
    return this.sentList;
  }

  getRecdList() {
    return this.receivedList;
  }

  pushRemindersToStorage() {
    let _me_ = this;

    _me_.storage.set(_me_.singletonService.recdStorageName, _me_.receivedList.map(x => x.toJSON()));
    
    _me_.storage.set(_me_.singletonService.sentStorageName, _me_.sentList.map(x => x.toJSON()));
  }

  loadReminders(): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.firestoreDBService.dbObj.collection("UserReminders").
      doc(_me_.singletonService.userAuthInfo.phoneNumber).
      onSnapshot((docSnapshot) => {
        if(docSnapshot.exists) {
          if(docSnapshot.data().received) {
            _me_.receivedList = docSnapshot.data().received.
            map(x=> {
              let obj : CReminderJSON = new CReminderJSON();
              obj.setObj(x);

              return obj; 
            });
          } else {
            _me_.receivedList = [];
          }
          
          if(docSnapshot.data().sent) {
            _me_.sentList = docSnapshot.data().sent.
            map(x=> {
              let obj : CReminderJSON = new CReminderJSON();
              obj.setObj(x);

              return obj; 
            });
          } else {
            _me_.sentList = [];
          }
          
          _me_.pushRemindersToStorage();

          resolve();
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  filterRemindersReceived(searchTerm: string){
    let _me_ = this;

    return Object.assign([], _me_.receivedList.filter((item) => {
        return (item.phoneNumber.indexOf(searchTerm.toLowerCase()) > -1 || item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }));
  }

  filterRemindersSent(searchTerm: string){
    let _me_ = this;

    return Object.assign([], _me_.sentList.filter((item) => {
        return (item.phoneNumber.indexOf(searchTerm.toLowerCase()) > -1 || item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }));
  }

  updateReceivedListFor(phoneNumber: string, reminder: IReminderJSON) {
    let _me_ = this;

    _me_.firestoreDBService.getDocumentWithID("UserReminders", phoneNumber).then( (uReminders) => {
      if(uReminders != null ) {
        let receivedList = uReminders.received ? uReminders.received : [];

        reminder.phoneNumber = _me_.singletonService.userAuthInfo.phoneNumber;
        receivedList.push( (<CReminderJSON>reminder).toJSON() );
        
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

        receivedList.push( (<CReminderJSON>reminder).toJSON() );
        
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
