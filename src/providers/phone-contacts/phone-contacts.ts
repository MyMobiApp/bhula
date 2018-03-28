//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';


import * as firebase from 'firebase';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

interface IInviteJSON {
    phoneNumber:  string;
    sentTimestamp: string;
    acceptedTimestamp: string;
    ignoredTimestamp: string;
    status: number; // Invited: 0, Accepted: 1, Ignored/Rejected: 2
}

export class CInviteJSON implements IInviteJSON {
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

  setObj(obj: IInviteJSON) {
    this.phoneNumber        = obj.phoneNumber;
    this.sentTimestamp      = obj.sentTimestamp ? (new Date(obj.sentTimestamp)).toLocaleString() : null ;
    this.acceptedTimestamp  = obj.acceptedTimestamp ? (new Date(obj.acceptedTimestamp)).toLocaleString() : null ;
    this.ignoredTimestamp   = obj.ignoredTimestamp ? (new Date(obj.ignoredTimestamp)).toLocaleString() : null ;
    this.status             = obj.status;
  }
}

interface ISentJSON {
  phoneNumber:  string;
  sentTimestamp: string;
}

export class CSentJSON implements ISentJSON {
  phoneNumber:  string;
  sentTimestamp: string;

  toJSON() {
    return {
      'phoneNumber' : this.phoneNumber,
      'sentTimestamp' : this.sentTimestamp 
    };
  }

  setObj(obj: ISentJSON) {
    this.phoneNumber = obj.phoneNumber;
    this.sentTimestamp = obj.sentTimestamp ? (new Date(obj.sentTimestamp)).toLocaleString() : null ;
  }
}

interface ICircleJSON {
  phoneNumber:        string;
  acceptedTimestamp:  string;
  minReminders:       number;
  maxReminders:       number;
}

export class CCircleJSON implements ICircleJSON {
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

  setObj(obj: ICircleJSON) {
    this.phoneNumber = obj.phoneNumber;
    this.acceptedTimestamp = obj.acceptedTimestamp ? (new Date(obj.acceptedTimestamp)).toLocaleString() : null ;
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
  
  bInvitePresent:     boolean;
  inviteExtra:        IInviteJSON;

  bSentPresent:       boolean;
  sentExtra:          ISentJSON;

  bCirclePresent:     boolean;
  circleExtra:        ICircleJSON;
}

export class CContactJSON implements ContactJSON{
  nameObj:            any;      // JSON Object
  displayName:        string;
  phoneNumber:        string;
  emailsObjAry:       any;
  onYadi:             boolean;
  image:              any;
  
  bInvitePresent:     boolean = false; // True : If inviteExtra is populated
  inviteExtra:        CInviteJSON = new CInviteJSON();

  bSentPresent:       boolean = false; // True : If sentExtra is populated
  sentExtra:          CSentJSON   = new CSentJSON();

  bCirclePresent:     boolean = false; // True : If circleExtra is populated
  circleExtra:        CCircleJSON = new CCircleJSON();

  toJSON() {
    return {
      'nameObj': this.nameObj,
      'displayName': this.displayName,
      'phoneNumber': this.phoneNumber,
      'emailsObjAry': this.emailsObjAry,
      'onYadi': this.onYadi,
      'image': this.image,

      'bInvitePresent': this.bInvitePresent,
      'inviteExtra': this.inviteExtra,

      'bSentPresent': this.bSentPresent,
      'sentExtra': this.sentExtra,

      'bCirclePresent': this.bCirclePresent,
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

  updateContactsWithCircle(): Promise<any>{
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.singletonService.storageContacts.forEach((obj, pos, ary) => {
        if(!obj.onYadi) {
          _me_.firebaseDBService.getDocumentWithID("UserCircle", _me_.singletonService.userAuthInfo.phoneNumber).then((data)=>{
            if(data != null) {
              if(data.circle) {
                data.circle.forEach((x, x_pos, x_ary) => {
                  let index = _me_.contactList.findIndex(iter => iter.phoneNumber === x.phoneNumber);
              
                  if(index != -1) {
                    _me_.contactList[index].circleExtra.acceptedTimestamp = x.acceptedTimestamp ? (new Date(x.acceptedTimestamp)).toLocaleString() : null;
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

      resolve(_me_.contactList);
    });
  }

  updateContactsWithInvites(){
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.singletonService.storageContacts.forEach((obj, pos, ary) => {
        if(!obj.onYadi) {
          _me_.firebaseDBService.getDocumentWithID("UserInvites", obj.phoneNumber).then((data)=>{
            if(data != null) {
              if(data.invites) {
                let iIndex = data.invites.findIndex(iter => iter.phoneNumber ===  _me_.singletonService.userAuthInfo.phoneNumber);

                if(iIndex != -1) {
                  let cIndex = data.contactList.findIndex(iter => iter.phoneNumber ===  obj.phoneNumber);

                  if(cIndex != -1) {
                    _me_.contactList[cIndex].inviteExtra.acceptedTimestamp = data.invites[iIndex].acceptedTimestamp ? (new Date(data.invites[iIndex].acceptedTimestamp)).toLocaleString() : null;
                    _me_.contactList[cIndex].inviteExtra.ignoredTimestamp  = data.invites[iIndex].ignoredTimestamp ? (new Date(data.invites[iIndex].ignoredTimestamp)).toLocaleString() : null;
                    _me_.contactList[cIndex].inviteExtra.sentTimestamp     = data.invites[iIndex].sentTimestamp ? (new Date(data.invites[iIndex].sentTimestamp)).toLocaleString() : null;
                    _me_.contactList[cIndex].inviteExtra.phoneNumber       = data.invites[iIndex].phoneNumber;
                    _me_.contactList[cIndex].inviteExtra.status            = data.invites[iIndex].status;

                    _me_.contactList[cIndex].bInvitePresent = true;
                  }
                }
              }

              if(data.sent) {
                let sIndex = data.sent.findIndex(iter => iter.phoneNumber ===  _me_.singletonService.userAuthInfo.phoneNumber);
                
                if(sIndex != -1) {
                  let cIndex = data.contactList.findIndex(iter => iter.phoneNumber ===  obj.phoneNumber);

                  if(cIndex != -1) {
                    _me_.contactList[cIndex].sentExtra.sentTimestamp = data.sent[sIndex].sentTimestamp ? (new Date(data.sent[sIndex].sentTimestamp)).toLocaleString() : null;
                    _me_.contactList[cIndex].sentExtra.phoneNumber   = data.sent[sIndex].phoneNumber;

                    _me_.contactList[cIndex].bSentPresent = true;
                  }
                }
              }
            }
          }).catch((error) => {
            console.log(error);
          });
        }
      });

      resolve(_me_.contactList);
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
