//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';


import * as firebase from 'firebase';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

interface InviteJSON {
    phoneNumber:  string;
    sentTimestamp: string;
    acceptedTimestamp: string;
    ignoredTimestamp: string;
    status: number; // Invited: 0, Accepted: 1, Ignored/Rejected: 2
}

export class CInviteJSON implements InviteJSON {
  phoneNumber:  string;
  sentTimestamp: string;
  acceptedTimestamp: string;
  ignoredTimestamp: string;
  status: number; // Invited: 0, Accepted: 1, Ignored/Rejected: 2

  toJSON() {
    return {
      'phoneNumber': this.phoneNumber,
      'sentTimestamp': this.sentTimestamp,
      'acceptedTimestamp': this.acceptedTimestamp,
      'ignoredTimestamp': this.ignoredTimestamp,
      'status': this.status
    };
  }

  setObj(obj: InviteJSON) {
    this.phoneNumber        = obj.phoneNumber;
    this.sentTimestamp      = obj.sentTimestamp;
    this.acceptedTimestamp  = obj.acceptedTimestamp;
    this.ignoredTimestamp   = obj.ignoredTimestamp;
    this.status             = obj.status;
  }
}

interface SentJSON {
  phoneNumber:  string;
  sentTimestamp: string;
}

export class CSentJSON implements SentJSON {
  phoneNumber:  string;
  sentTimestamp: string;

  toJSON() {
    return {
      'phoneNumber' : this.phoneNumber,
      'sentTimestamp' : this.sentTimestamp 
    };
  }

  setObj(obj: SentJSON) {
    this.phoneNumber = obj.phoneNumber;
    this.sentTimestamp = obj.sentTimestamp;
  }
}

interface CircleJSON {
  phoneNumber:        string;
  acceptedTimestamp:  string;
  minReminders:       number;
  maxReminders:       number;
}

export class CCircleJSON implements CircleJSON {
  phoneNumber:        string;
  acceptedTimestamp:  string;
  minReminders:       number;
  maxReminders:       number;

  toJSON() {
    return {
      'phoneNumber' : this.phoneNumber,
      'acceptedTimestamp' : this.acceptedTimestamp,
      'minReminders' : this.minReminders,
      'maxReminders' : this.maxReminders
    };
  }

  setObj(obj: CircleJSON) {
    this.phoneNumber = obj.phoneNumber;
    this.acceptedTimestamp = obj.acceptedTimestamp;
    this.minReminders = obj.minReminders;
    this.maxReminders = obj.maxReminders;
  }
}

interface ContactJSON {
  nameObj:            any;      // JSON Object
  displayName:        string;
  phoneNumber:        string;
  emailsObjAry:       any;
  onYadi:             boolean;
  image:              any;
  received:           boolean; // True : If part of Invites list, False : If part of Sent List

  inviteExtra:        InviteJSON;
  sentExtra:          SentJSON;
  circleExtra:        CircleJSON;
}

export class CContactJSON implements ContactJSON{
  nameObj:            any;      // JSON Object
  displayName:        string;
  phoneNumber:        string;
  emailsObjAry:       any;
  onYadi:             boolean;
  image:              any;
  received:           boolean; // True : If part of Invites list, False : If part of Sent List

  inviteExtra:        CInviteJSON = new CInviteJSON();
  sentExtra:          CSentJSON   = new CSentJSON();
  circleExtra:        CCircleJSON = new CCircleJSON();

  toJSON() {
    return {
      'nameObj': this.nameObj,
      'displayName': this.displayName,
      'phoneNumber': this.phoneNumber,
      'emailsObjAry': this.emailsObjAry,
      'onYadi': this.onYadi,
      'image': this.image,
      'received': this.received,

      'inviteExtra': this.inviteExtra,
      'sentExtra': this.sentExtra,
      'circleExtra': this.circleExtra
    };
  }
}

/*
  Generated class for the PhoneContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PhoneContactsProvider {
  contactList: ContactJSON[] = [];
  bListUpdated: boolean = false;
  storageContacts: any = {};

  firebaseDBService: FirestoreDBServiceProvider;
  singletonService: SingletonServiceProvider;

  contactsCount: number       = 0;

  constructor(public contacts: Contacts,
              public sanitizer: DomSanitizer,
              public storage: Storage) {
      
    //this.loadContacts();
  }

  initFirestoreAndSingleton(firebaseDBService: FirestoreDBServiceProvider, 
                            singletonService: SingletonServiceProvider) {
    this.firebaseDBService  = firebaseDBService;
    this.singletonService   = singletonService;
  }

  loadContacts(): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.contacts.find(['displayName', 'name', 'phoneNumbers', 'photos', 'emails'], 
      {filter: '', hasPhoneNumber: true, multiple: true})
      .then(data => {
        var phExists = -1;
        _me_.contactsCount = data.length;

        data.forEach((x, x_index, x_ary) => {
          if(x.displayName !== null) {
            x.phoneNumbers.forEach((y, y_index, y_ary) => {
              let contact : CContactJSON = new CContactJSON();

              contact.displayName   = x.displayName;
              contact.nameObj       = x.name;
              contact.phoneNumber   = y.value.replace(/\s+/g, '');
              contact.emailsObjAry  = x.emails;

              if(_me_.singletonService.storageContacts !== null && Array.isArray(_me_.singletonService.storageContacts) && _me_.singletonService.storageContacts.length > 0) {
                phExists = _me_.singletonService.storageContacts.findIndex(iter => iter.phoneNumber === contact.phoneNumber);
              } else {
                phExists = -1;
              }

              if(phExists != -1) {
                contact.onYadi      = _me_.singletonService.storageContacts[phExists].onYadi;
              } else {
                contact.onYadi      = false;
              }

              if(x.photos != null) {
                contact.image = _me_.sanitizer.bypassSecurityTrustUrl(x.photos[0].value);
              } else {
                contact.image = "assets/imgs/person-placeholder.png";
              }

              let pos = _me_.contactList.findIndex(iter => iter.phoneNumber === contact.phoneNumber);
              
              if(pos == -1) {
                _me_.contactList.push(contact);

                if(phExists == -1) {
                  _me_.singletonService.storageContacts.push({phoneNumber: contact.phoneNumber, onYadi: contact.onYadi});
                }
              }
            });
          }
        });
       
        _me_.storage.set(_me_.singletonService.phoneStorageContactsName, JSON.stringify(_me_.singletonService.storageContacts));
        
        _me_.checkContactsOnServer();

        _me_.contactList.sort((cur, next) => (<string>cur.displayName) < (<string>next.displayName) ? -1 : (<string>cur.displayName) > (<string>next.displayName) ? 1 : 0);
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  filterItems(searchTerm: string, bPhone: boolean = false){
    let _me_ = this;

    return Object.assign([], _me_.contactList.filter((item) => {
        if(bPhone) {
          return item.phoneNumber.indexOf(searchTerm.toLowerCase()) > -1;
        } else {
          return (item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || item.phoneNumber.indexOf(searchTerm.toLowerCase()) > -1);
        }
      }));
  }

  mapInviteContacts(inviteList: any, sentList: any) {
    let _me_ = this;
    let retContacts = [];

    inviteList.forEach((value, index, ary) => {
      var pos = _me_.contactList.findIndex(iter => iter.phoneNumber === value.phoneNumber);

      let item = _me_.contactList[pos];
      item.inviteExtra.sentTimestamp = value.sentTimestamp;
      item.inviteExtra.acceptedTimestamp = value.acceptedTimestamp;
      item.inviteExtra.ignoredTimestamp = value.ignoredTimestamp;
      item.inviteExtra.status = value.status;
      item.received = true;

      if(pos > -1) {
        retContacts.push(item);
      }
    });
    
    sentList.forEach((value, index, ary) => {
      var pos = _me_.contactList.findIndex(iter => iter.phoneNumber === value.phoneNumber);

      let item = _me_.contactList[pos];
      item.sentExtra.sentTimestamp = value.sentTimestamp;
      item.received = false;

      if(pos > -1) {
        retContacts.push(item);
      }
    });

    return retContacts;
  }

  mapCircleContacts(circleList: any) {
    let _me_ = this;
    let retContacts = [];

    circleList.forEach((value, index, ary) => {
      var pos = _me_.contactList.findIndex(iter => iter.phoneNumber === value.phoneNumber);

      let item = _me_.contactList[pos];
      item.circleExtra.acceptedTimestamp = value.sentTimestamp;
      item.received = true;

      if(pos > -1) {
        retContacts.push(item);
      }
    });
    
    return retContacts;
  }

  checkContactsOnServer() {
    let _me_ = this;
    
    _me_.singletonService.storageContacts.forEach((obj, pos, ary) => {
      
      if(!obj.onYadi) {
        _me_.firebaseDBService.getDocumentWithID("Users", obj.phoneNumber).then((data)=>{
          if(data != null) {
            ary[pos].onYadi = true;
            
            let index = _me_.contactList.findIndex(iter => iter.phoneNumber === data.phoneNumber);
            if(index != -1) {
              _me_.contactList[index].onYadi = true;
            }
          }

          if((pos+1) == ary.length) {
            _me_.storage.set(_me_.singletonService.phoneStorageContactsName, JSON.stringify(_me_.singletonService.storageContacts));

            _me_.bListUpdated = true;
          }
        }).catch ((error) => {
          console.log(error);
        });
      }
    });
  }

  updateContactsWithCircle(){
    let _me_ = this;
    
    _me_.singletonService.storageContacts.forEach((obj, pos, ary) => {
      if(!obj.onYadi) {
        _me_.firebaseDBService.getDocumentWithID("UserCircle", obj.phoneNumber).then((data)=>{
          if(data != null) {
            if(data.circle) {
              data.circle.map((x, x_pos, x_ary) => {
                let index = _me_.contactList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
            
                if(index != -1) {
                  _me_.contactList[index].circleExtra.acceptedTimestamp = x.acceptedTimestamp;
                  _me_.contactList[index].circleExtra.minReminders      = x.minReminders;
                  _me_.contactList[index].circleExtra.maxReminders      = x.maxReminders;
                  _me_.contactList[index].circleExtra.phoneNumber       = x.phoneNumber;
                }
              });
            }
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  updateInvitesWithCircle(){
    let _me_ = this;
    
    _me_.singletonService.storageContacts.forEach((obj, pos, ary) => {
      if(!obj.onYadi) {
        _me_.firebaseDBService.getDocumentWithID("UserInvites", obj.phoneNumber).then((data)=>{
          if(data != null) {
            if(data.invites) {
              data.invites.map((x, x_pos, x_ary) => {
                let index = _me_.contactList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
            
                if(index != -1) {
                  _me_.contactList[index].inviteExtra.acceptedTimestamp = x.acceptedTimestamp;
                  _me_.contactList[index].inviteExtra.ignoredTimestamp  = x.ignoredTimestamp;
                  _me_.contactList[index].inviteExtra.sentTimestamp     = x.sentTimestamp;
                  _me_.contactList[index].inviteExtra.phoneNumber       = x.phoneNumber;
                  _me_.contactList[index].inviteExtra.status            = x.status;
                }
              });
            }

            if(data.sent) {
              data.sent.map((x, x_pos, x_ary) => {
                let index = _me_.contactList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
            
                if(index != -1) {
                  _me_.contactList[index].sentExtra.sentTimestamp = x.sentTimestamp;
                  _me_.contactList[index].sentExtra.phoneNumber   = x.phoneNumber;
                }
              });
            }
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  /*
  *
  * To Push all contacts in Firestore DB. For testing purpose.
  * 
  */
  SyncUserContactsInDB() {
    let _me_ = this;

    _me_.firebaseDBService.initFirestoreDB(firebase);
    _me_.firebaseDBService.getDocumentWithID("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber)
    .then ((data) => {
      if(data != null) {
        // User already exists in DB, update it
        _me_.firebaseDBService.updateDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, {'storage_contacts':_me_.singletonService.storageContacts})
        .then((data) => {
          alert(JSON.stringify(data));
          console.log("addDocument: " + JSON.stringify(data));
        }, (error) => {
          alert(error);
          console.log(error);
        });
      }
      else {
        // This is new user and requires to be added to the 'Users' collection
        
        _me_.firebaseDBService.addDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, {'storage_contacts':_me_.singletonService.storageContacts})
        .then((data) => {
          alert(JSON.stringify(data));
          console.log("addDocument: " + JSON.stringify(data));
        }, (error) => {
          alert(error);
          console.log(error);
        });
      }
    }, (error) => {
      alert(error);
      console.log(error);
    });
  }
}
