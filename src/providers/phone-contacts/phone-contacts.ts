//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';

import * as firebase from 'firebase';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

/*
  Generated class for the PhoneContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PhoneContactsProvider {
  contactList: any = [];
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

    //_me_.storage.set('phoneContacts', _me_.storageContacts);

    return new Promise((resolve, reject) => {
      _me_.contacts.find(['displayName', 'name', 'phoneNumbers', 'photos', 'emails'], 
      {filter: '', hasPhoneNumber: true, multiple: true})
      .then(data => {
        var phExists = -1;
        _me_.contactsCount = data.length;

        for (var i=0 ; i < data.length; i++){
          if(data[i].displayName !== null) {
            for (var phIndex = 0; phIndex < data[i].phoneNumbers.length; phIndex++) {
              let contact = {};
              contact["displayName"]    = data[i].displayName;
              contact["name"]           = data[i].name;
              contact["number"]         = data[i].phoneNumbers[phIndex].value.replace(/\s+/g, '');
              
              if(data[i].emails != null) {
                contact["email"] = data[i].emails[0].value;
              } else {
                contact["email"] = "";
              }

              if(_me_.singletonService.storageContacts !== null && Array.isArray(_me_.singletonService.storageContacts) && _me_.singletonService.storageContacts.length > 0) {
                phExists = _me_.singletonService.storageContacts.findIndex(iter => iter.phoneNumber === contact["number"]);
              } else {
                phExists = -1;
              }
              
              if(phExists != -1) {
                contact["onYadi"]         = _me_.singletonService.storageContacts[phExists].onYadi;
              } else {
                contact["onYadi"]         = false;
              }
              
              if(data[i].photos != null) {
                console.log(data[i].photos);
                contact["image"] = _me_.sanitizer.bypassSecurityTrustUrl(data[i].photos[0].value);
                console.log(contact);
              } else {
                contact["image"] = "assets/imgs/person-placeholder.png";
              }
              
              var pos = _me_.contactList.findIndex(iter => iter.number === contact["number"]);
              
              if(pos == -1) {
                _me_.contactList.push(contact);

                if(phExists == -1) {
                  _me_.singletonService.storageContacts.push({phoneNumber: contact["number"], onYadi: contact["onYadi"]});
                }
              }
            }
          }
        }
        
        _me_.storage.set(_me_.singletonService.phoneStorageName, JSON.stringify(_me_.singletonService.storageContacts));
        
        _me_.checkContactsOnServer();

        _me_.contactList.sort((cur, next) => (<string>cur['displayName']) < (<string>next['displayName']) ? -1 : (<string>cur['displayName']) > (<string>next['displayName']) ? 1 : 0);
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  filterItems(searchTerm: string){
    let _me_ = this;

    return Object.assign([], this.contactList.filter((item) => {
        return item['displayName'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      }));
  }

  checkContactsOnServer() {
    let _me_ = this;
    let iter = 0;
    
    _me_.singletonService.storageContacts.forEach((obj, pos, ary) => {
      _me_.firebaseDBService.getDocumentWithID("Users", obj.phoneNumber).then((data)=>{
        iter++;

        if(data != null) {
          let index = _me_.singletonService.storageContacts.findIndex(iter => iter.phoneNumber === data.phoneNumber);
          if(index != -1) {
            _me_.singletonService.storageContacts[index].onYadi = true;
          }

          index = _me_.contactList.findIndex(iter => iter.number === data.phoneNumber);
          if(index != -1) {
            _me_.contactList[index].onYadi = true;
          }
        }

        if(iter == ary.length) {
          _me_.storage.set(_me_.singletonService.phoneStorageName, JSON.stringify(_me_.singletonService.storageContacts));

          _me_.bListUpdated = true;
        }
      }).catch ((error) => {
        console.log(error);
      });  
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
        _me_.firebaseDBService.updateDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, JSON.stringify(_me_.singletonService.storageContacts))
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
        
        _me_.firebaseDBService.addDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, JSON.stringify(_me_.singletonService.storageContacts))
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
