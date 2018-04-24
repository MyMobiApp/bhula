import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { CReminderJSON, IReminderJSON, ReminderStatus } from '../../reminder-interfaces';

import { NotificationServiceProvider } from '../../providers/notification-service/notification-service';
import { SingletonServiceProvider } from '../singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../firestore-db-service/firestore-db-service';

/*
  Generated class for the ReminderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReminderServiceProvider {
  firestoreDBService: FirestoreDBServiceProvider;
  singletonService: SingletonServiceProvider;
  notificationService: NotificationServiceProvider;

  sentList:     CReminderJSON[] = [];
  receivedList: CReminderJSON[] = [];

  receivedSubscriber: Observable<CReminderJSON[]>;
  receivedObserver: any ;

  sentSubscriber: Observable<CReminderJSON[]>;
  sentObserver: any;

  constructor(private storage: Storage) {
    let _me_ = this;

    this.receivedSubscriber = new Observable(observer => {
      _me_.receivedObserver = observer;
    });
    // Observables are lazy load, need to call subscribe to invoke callback in constructor
    this.receivedSubscriber.subscribe();

    this.sentSubscriber = new Observable(observer => {
      _me_.sentObserver = observer;
    });
    // Observables are lazy load, need to call subscribe to invoke callback in constructor
    this.sentSubscriber.subscribe();
  }

  initProviders(firestoreDBService: FirestoreDBServiceProvider, 
                singletonService: SingletonServiceProvider, 
                notificationService: NotificationServiceProvider ) {
    this.firestoreDBService   = firestoreDBService;
    this.singletonService     = singletonService;
    this.notificationService  = notificationService;

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
              
              // --------------------------------------------------
              // Set notification
              // --------------------------------------------------
              if(obj.status == ReminderStatus.ReceivedOrSent || 
                 obj.status == ReminderStatus.Accepted) {
                let rDate = new Date(obj.date + ' ' + obj.time);
                _me_.notificationService.
                setReminderNotification(obj.id, obj.title, rDate.toLocaleString(), rDate);
              } else if (obj.status == ReminderStatus.CanceledBySender || 
                      obj.status == ReminderStatus.IgnoredByReceiver) {
                _me_.notificationService.cancelNotification(obj.id);
              }
              // --------------------------------------------------

              // --------------------------------------------------
              // Update status
              // --------------------------------------------------
              let now   = new Date();
              let remDate = new Date(obj.date + ' ' + obj.time);

              if(remDate > now) {
                obj.status = 5;
              }
              // --------------------------------------------------

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
              // --------------------------------------------------
              // Update status
              // --------------------------------------------------
              let now   = new Date();
              let remDate = new Date(obj.date + ' ' + obj.time);
              if(remDate > now) {
                obj.status = 5;
              }
              // --------------------------------------------------
              
              return obj; 
            });
          } else {
            _me_.sentList = [];
          }
          
          try {
            _me_.receivedObserver.next(_me_.receivedList);
            _me_.sentObserver.next(_me_.sentList);
          } catch (e) {
            alert(e);
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

    try{
      _me_.firestoreDBService.getDocumentWithID("UserReminders", phoneNumber).then( (uReminders) => {
        if(uReminders != null ) {
          let itemCount    = uReminders.itemCount ? uReminders.itemCount : 0;
          let receivedList = uReminders.received ? uReminders.received : [];
          
          itemCount++;

          reminder.id          = itemCount;
          reminder.phoneNumber = _me_.singletonService.userAuthInfo.phoneNumber;
          
          receivedList.push( (<CReminderJSON>reminder).toJSON() );
          
          _me_.firestoreDBService.
          updateDocument("UserReminders", phoneNumber, {'itemCount': itemCount, 'received': receivedList}).
          then(data => {
            // Document updated
            alert("Reminder has set for < " + phoneNumber + " >");
          }, error => {
            alert(error)
          }).catch( (excp) => {
            alert(excp);
          });
        } else {
          let itemCount    = 1;
          let receivedList = [];

          reminder.id          = itemCount;
          receivedList.push( (<CReminderJSON>reminder).toJSON() );
          
          _me_.firestoreDBService.
          addDocument("UserReminders", phoneNumber, {'itemCount': itemCount, 'received': receivedList}).
          then(data => {
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
    } catch (e){
      alert(e);
    }
    
  }

  updateSentListForMe(sentList: any) {
    let _me_ = this;

    _me_.firestoreDBService.
    getDocumentWithID("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber).
    then( (uReminders) => {
      if(uReminders != null) {
        let itemCount    = uReminders.itemCount ? uReminders.itemCount : 0;
        itemCount++;

        sentList.forEach(element => {
          element.id = itemCount;
          itemCount++;
        });

        let dbSentList = uReminders.sent ? uReminders.sent.concat(sentList) : [];

        _me_.firestoreDBService.
        updateDocument("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber, 
                      {'itemCount': itemCount,'sent': dbSentList}).
        then(() => {
          // Document updated, set notification
          sentList.forEach(element => {
            let rDate = new Date(element.date + ' ' + element.time);

            _me_.notificationService.
            setReminderNotification(element.id, element.title, rDate.toLocaleString(), rDate);
          });
        }, error => {
          alert(error)
        }).catch( (excp) => {
          alert(excp);
        });
      } else {
        let itemCount    = 1;

        sentList.forEach(element => {
          element.id = itemCount;
          itemCount++;
        });

        _me_.firestoreDBService.
        addDocument("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber, 
                  {'itemCount': itemCount,'sent': sentList}).then(data => {
          // Document updated, set notification
          sentList.forEach(element => {
            let rDate = new Date(element.date + ' ' + element.time);
            
            _me_.notificationService.
            setReminderNotification(element.id, element.sTitle, rDate.toLocaleString(), rDate);
          });
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

  doneIfReceivedStatus(index: number) {
    let _me_ = this;

    let now   = new Date();
    let rDate = new Date(_me_.receivedList[index].date + ' ' + _me_.receivedList[index].time);

    if(rDate > now) {
      _me_.receivedList[index].status = ReminderStatus.Done;
    }

    _me_.receivedObserver.next(_me_.receivedList);
  }

  doneIfSentStatus(index: number) {
    let _me_ = this;

    let now   = new Date();
    let rDate = new Date(_me_.sentList[index].date + ' ' + _me_.sentList[index].time);

    if(rDate > now) {
      _me_.sentList[index].status = ReminderStatus.Done;
    }

    _me_.sentObserver.next(_me_.sentList);
  }

  changeReceivedStatus(phoneNumber: string, status: number) {
    let _me_ = this;

    let rIndex = _me_.receivedList.findIndex(iter => iter.phoneNumber === phoneNumber);
    
    if(rIndex != null) {
      _me_.firestoreDBService.
      getDocumentWithID("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber).
      then((data) => {
        if(data != null) {
          if(data.received) {
            let pos = data.received.findIndex(iter => iter.phoneNumber === phoneNumber);

            data.received[pos].status = status;
            _me_.firestoreDBService.
            updateDocument("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber, {'received': data.received}).
            then((val) => {
              // Document updated, update local as well
              _me_.receivedList[rIndex].status = status;
              _me_.receivedObserver.next(_me_.receivedList);
            }).catch((error) => {
              alert(error);
            });
          }
        }
      }).catch((error) => {
        alert(error);
      });
    }
  }

  changeSentStatus(phoneNumber: string, status: number) {
    let _me_ = this;

    let rIndex = _me_.sentList.findIndex(iter => iter.phoneNumber === phoneNumber);
    
    if(rIndex != null) {
      _me_.firestoreDBService.
      getDocumentWithID("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber).
      then((data) => {
        if(data != null) {
          if(data.sent) {
            let pos = data.sent.findIndex(iter => iter.phoneNumber === phoneNumber);

            data.sent[pos].status = status;
            _me_.firestoreDBService.
            updateDocument("UserReminders", _me_.singletonService.userAuthInfo.phoneNumber, {'sent': data.sent}).
            then((val) => {
              // Document updated, update local as well
              _me_.sentList[rIndex].status = status;
              _me_.sentObserver.next(_me_.sentList);
            }).catch((error) => {
              alert(error);
            });
          }
        }
      }).catch((error) => {
        alert(error);
      });
    }
  }
}
