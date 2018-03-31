//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';

import { IInviteJSON, CInviteJSON, ISentJSON, CSentJSON }  from '../../contact-interfaces';
import { ICircleJSON, CCircleJSON, IContactJSON, CContactJSON }  from '../../contact-interfaces';
import { IContactForStorage, CContactForStorage } from '../../contact-interfaces';


import * as firebase from 'firebase';
import { SingletonServiceProvider } from '../singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../firestore-db-service/firestore-db-service';


/*
  Generated class for the PhoneContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PhoneContactsProvider {
  contactList: IContactJSON[] = [];
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

              if(_me_.singletonService.contactStorageList !== null && Array.isArray(_me_.singletonService.contactStorageList) && _me_.singletonService.contactStorageList.length > 0) {
                phExists = _me_.singletonService.contactStorageList.findIndex(iter => iter.phoneNumber === contact.phoneNumber);
              } else {
                phExists = -1;
              }

              if(phExists != -1) {
                contact.onYadi          = _me_.singletonService.contactStorageList[phExists].onYadi;

                contact.bCirclePresent  = _me_.singletonService.contactStorageList[phExists].bCirclePresent;
                if(contact.bCirclePresent) {
                  contact.circleExtra.setObj(_me_.singletonService.contactStorageList[phExists].circleExtra.toJSON());
                }

                contact.bSentPresent    = _me_.singletonService.contactStorageList[phExists].bSentPresent;
                if(contact.bSentPresent) {
                  contact.sentExtra.setObj(_me_.singletonService.contactStorageList[phExists].sentExtra.toJSON());
                }

                contact.bInvitePresent  = _me_.singletonService.contactStorageList[phExists].bInvitePresent;
                if(contact.bInvitePresent) {
                  contact.inviteExtra.setObj(_me_.singletonService.contactStorageList[phExists].inviteExtra.toJSON());
                }
              } else {
                contact.onYadi          = false;
                contact.bCirclePresent  = false;
                contact.bSentPresent    = false;
                contact.bInvitePresent  = false;
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
                  // create object and push
                  let ct = new CContactForStorage();
                  ct.phoneNumber  = contact.phoneNumber;
                  ct.onYadi       = contact.onYadi;
                  
                  _me_.singletonService.contactStorageList.push(ct);
                }
              }
            });
          }
        });
       
        _me_.contactList.sort((cur, next) => (<string>cur.displayName) < (<string>next.displayName) ? -1 : (<string>cur.displayName) > (<string>next.displayName) ? 1 : 0);
        
        resolve(_me_.contactList);
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

  getUserInvitesCollectionList() {
    let _me_ = this;
    let inviteContactList: CContactJSON[] = [];

    _me_.contactList.forEach((obj, pos, ary) => {
      if(obj.bInvitePresent || obj.bSentPresent) {
        inviteContactList.push(<CContactJSON>obj);
      }
    });

    return inviteContactList;
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
      item.bInvitePresent = true;

      if(pos > -1) {
        retContacts.push(item);
      }
    });
    
    sentList.forEach((value, index, ary) => {
      var pos = _me_.contactList.findIndex(iter => iter.phoneNumber === value.phoneNumber);

      let item = _me_.contactList[pos];
      item.sentExtra.sentTimestamp = value.sentTimestamp;
      item.bSentPresent = true;

      if(pos > -1) {
        retContacts.push(item);
      }
    });

    return retContacts;
  }

  getUserCirclesCollectionList() {
    let _me_ = this;
    let circleContactList: CContactJSON[] = [];

    _me_.contactList.forEach((obj, pos, ary) => {
      if(obj.bCirclePresent) {
        circleContactList.push(<CContactJSON>obj);
      }
    });

    return circleContactList;
  }

  mapCircleContacts(circleList: ICircleJSON[]) {
    let _me_ = this;
    let retContacts = [];

    circleList.forEach((value, index, ary) => {
      var pos = _me_.contactList.findIndex(iter => iter.phoneNumber === value.phoneNumber);

      let item = _me_.contactList[pos];
      item.circleExtra.acceptedTimestamp = value.acceptedTimestamp ? (new Date(value.acceptedTimestamp)).toLocaleString() : null;
      item.bCirclePresent = true;

      if(pos > -1) {
        retContacts.push(item);
      }
    });
    
    return retContacts;
  }

  checkContactsOnServer(): Promise<any> {
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.singletonService.contactStorageList.forEach((obj, pos, ary) => {
      
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
              _me_.bListUpdated = true;
              
              resolve(_me_.contactList);
            }
          }).catch ((error) => {
            console.log(error);
          });
        }
      });
    }); 
  }

  updateContactsWithCircle(): Promise<any>{
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.firebaseDBService.getDocumentWithID("UserCircle", _me_.singletonService.userAuthInfo.phoneNumber).then((data)=>{
        if(data != null) {
          if(data.circle) {
            data.circle.forEach((x, x_pos, x_ary) => {
              let index = _me_.contactList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
              let pos = _me_.singletonService.contactStorageList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
          
              if(index != -1) {
                _me_.contactList[index].circleExtra.acceptedTimestamp = x.acceptedTimestamp ? (new Date(x.acceptedTimestamp)).toLocaleString() : null;
                _me_.singletonService.contactStorageList[pos].circleExtra.acceptedTimestamp = _me_.contactList[index].circleExtra.acceptedTimestamp;

                _me_.contactList[index].circleExtra.minReminders      = x.minReminders;
                _me_.singletonService.contactStorageList[pos].circleExtra.minReminders = x.minReminders;

                _me_.contactList[index].circleExtra.maxReminders      = x.maxReminders;
                _me_.singletonService.contactStorageList[pos].circleExtra.maxReminders = x.maxReminders;

                _me_.contactList[index].circleExtra.phoneNumber       = x.phoneNumber;
                _me_.singletonService.contactStorageList[pos].circleExtra.phoneNumber = x.phoneNumber;

                _me_.contactList[index].bCirclePresent = true;
                _me_.singletonService.contactStorageList[pos].bCirclePresent = true;
              }
            });
          }
        }
        
        resolve(_me_.contactList);

      }).catch((error) => {
        console.log(error);
      });
    });
  }

  updateContactsWithInvites(): Promise<any>{
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.firebaseDBService.getDocumentWithID("UserInvites", _me_.singletonService.userAuthInfo.phoneNumber).then((data)=>{
        if(data != null) {
          if(data.invites) {
            data.invites.forEach((x, x_pos, x_ary) => {
              let cIndex = _me_.contactList.findIndex(iter => iter.phoneNumber ===  x.phoneNumber);
              let pos = _me_.singletonService.contactStorageList.findIndex(iter => iter.phoneNumber === x.phoneNumber);

              if(cIndex != -1) {
                _me_.contactList[cIndex].inviteExtra.acceptedTimestamp = x.acceptedTimestamp ? (new Date(x.acceptedTimestamp)).toLocaleString() : null;
                _me_.singletonService.contactStorageList[pos].inviteExtra.acceptedTimestamp = _me_.contactList[cIndex].inviteExtra.acceptedTimestamp;

                _me_.contactList[cIndex].inviteExtra.ignoredTimestamp  = x.ignoredTimestamp ? (new Date(x.ignoredTimestamp)).toLocaleString() : null;
                _me_.singletonService.contactStorageList[pos].inviteExtra.ignoredTimestamp = _me_.contactList[cIndex].inviteExtra.ignoredTimestamp;

                _me_.contactList[cIndex].inviteExtra.sentTimestamp     = x.sentTimestamp ? (new Date(x.sentTimestamp)).toLocaleString() : null;
                _me_.singletonService.contactStorageList[pos].inviteExtra.sentTimestamp = _me_.contactList[cIndex].inviteExtra.sentTimestamp;

                _me_.contactList[cIndex].inviteExtra.phoneNumber       = x.phoneNumber;
                _me_.singletonService.contactStorageList[pos].inviteExtra.phoneNumber = x.phoneNumber;

                _me_.contactList[cIndex].inviteExtra.status            = x.status;
                _me_.singletonService.contactStorageList[pos].inviteExtra.status = x.status;

                _me_.contactList[cIndex].bInvitePresent = true;
                _me_.singletonService.contactStorageList[pos].bInvitePresent = true;
              }
            });
          }

          if(data.sent) {
            data.sent.forEach((x, x_pos, x_ary) => {
              let cIndex = _me_.contactList.findIndex(iter => iter.phoneNumber ===  x.phoneNumber);
              let pos = _me_.singletonService.contactStorageList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
              
              if(cIndex != -1) {
                _me_.contactList[cIndex].sentExtra.sentTimestamp = x.sentTimestamp ? (new Date(x.sentTimestamp)).toLocaleString() : null;
                _me_.singletonService.contactStorageList[pos].sentExtra.sentTimestamp = _me_.contactList[cIndex].sentExtra.sentTimestamp;

                _me_.contactList[cIndex].sentExtra.phoneNumber   = x.phoneNumber;
                _me_.singletonService.contactStorageList[pos].sentExtra.phoneNumber = x.phoneNumber;

                _me_.contactList[cIndex].bSentPresent = true;
                _me_.singletonService.contactStorageList[pos].bSentPresent = true;
              }
            });
          }
        }
        
        resolve(_me_.contactList);
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  pushContactsToStorage() {
    let _me_ = this;

    let contactStorageList = _me_.singletonService.contactStorageList.map( x => x.toJSON());

    _me_.storage.set( _me_.singletonService.contactStorageListName, JSON.stringify(contactStorageList) );
  }
  
  /*
  *
  * To restore all contacts from local storage.
  * 
  */
  restoreContactsFromStorage() {
    let _me_ = this;

    _me_.storage.get(_me_.singletonService.contactStorageListName).then( (data) => {
      let contactStorageList = JSON.parse(data);

      (<IContactForStorage[]>contactStorageList).forEach((obj, index, ary) => {
        let contact = new CContactJSON();

        contact.phoneNumber     = obj.phoneNumber;
        contact.onYadi          = obj.onYadi;

        contact.bCirclePresent  = obj.bCirclePresent;
        contact.circleExtra.setObj(obj.circleExtra);

        contact.bInvitePresent  = obj.bInvitePresent;
        contact.inviteExtra.setObj(obj.inviteExtra);

        contact.bSentPresent    = obj.bSentPresent;
        contact.sentExtra.setObj(obj.sentExtra);

        _me_.contactList.push(contact);
      });
    }).catch( (error) => {
      console.log(error);
    });
  }

  /*
  *
  * To Push all contacts in Firestore DB. For testing purpose.
  * [ Not in use right now, available for future use]
  * 
  */
  SyncUserContactsInDB() {
    let _me_ = this;

    _me_.firebaseDBService.initFirestoreDB(firebase);
    _me_.firebaseDBService.getDocumentWithID("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber)
    .then ((data) => {
      if(data != null) {
        // User already exists in DB, update it
        _me_.firebaseDBService.updateDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, {'storage_contacts': JSON.stringify(_me_.singletonService.contactStorageList.map( x => x.toJSON()))})
        .then((data) => {
          //alert(JSON.stringify(data));
          console.log("addDocument: " + JSON.stringify(data));
        }, (error) => {
          alert(error);
          console.log(error);
        });
      }
      else {
        // This is new user and requires to be added to the 'Users' collection
        
        _me_.firebaseDBService.addDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, {'storage_contacts': JSON.stringify(_me_.singletonService.contactStorageList.map( x => x.toJSON()))})
        .then((data) => {
          //alert(JSON.stringify(data));
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
