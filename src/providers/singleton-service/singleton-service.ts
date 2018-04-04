import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { IContactForStorage, CContactForStorage } from '../../contact-interfaces';

/*
  Generated class for the SingletonServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SingletonServiceProvider {
  public loginState:boolean       = false;
  public userAuthInfo: any        = {};
  public simInfo: any             = {};
  public shareAndroidMsg: string;
  public shareIOSMsg: string;
  public shareGenericMsg: string;
  public shareSubject: string;
  public playStoreURL: string     = "https://goo.gl/rcv5Kv";
  public appStoreURL: string      = "https://goo.gl/rcv5Kv";
  public appName: string          = "Yaydi";

  public contactStorageList: CContactForStorage[] = [];
  public contactStorageListName: string = 'contactStorageList';

  public sentStorageName: string = "sentReminders" ;
  public recdStorageName: string = "receivedReminders" ;
  public sentList:     any = [];
  public receivedList: any = [];

  public fcmPushTopicAddReminder = "addReminder";
  public fcmPushTopicRemind = "remind";
  
  constructor(private storage: Storage) {
    let _me_ = this;

    _me_.shareAndroidMsg  = "Hey! I am creating my circle on " + _me_.appName + " App, I am forgetful ☺ and this is to let people I trust - remind me whatever they feel important to me. Please install it from Play Store at " + this.playStoreURL + " and let's remind each other 🤘.";
    _me_.shareIOSMsg  	  = "Hey! I am creating my circle on " + _me_.appName + " App, I am forgetful ☺ and this is to let people I trust - remind me whatever they feel important to me. Please install it from App Store at " + this.appStoreURL + " and let's remind each other 🤘.";
    _me_.shareGenericMsg  = "Hey! I am creating my circle on " + _me_.appName + " App, I am forgetful ☺ and this is to let people I trust - remind me whatever they feel important to me. Please install it from Play Store at " + this.playStoreURL + ", or from App Store at " + this.appStoreURL + " and let's remind each other 🤘.";

    _me_.shareSubject = "Come join me on " + _me_.appName + " App!";

    storage.ready().then((value) => {

      _me_.restoreContactsFromStorage();
      _me_.restoreRemindersFromStorage();
      
    }).catch((error) => {
      console.log(error);
    });
    
  }

  restoreContactsFromStorage() {
    let _me_ = this;

    _me_.storage.get(_me_.contactStorageListName).then( (data) => {
        if(data) {
          let contactStorageList = JSON.parse(data);

          (<IContactForStorage[]>contactStorageList).forEach((obj, index, ary) => {
            let contact = new CContactForStorage();

            contact.phoneNumber     = obj.phoneNumber;
            contact.onYadi          = obj.onYadi;

            contact.bCirclePresent  = obj.bCirclePresent;
            contact.circleExtra.setObj(obj.circleExtra);

            contact.bInvitePresent  = obj.bInvitePresent;
            contact.inviteExtra.setObj(obj.inviteExtra);

            contact.bSentPresent    = obj.bSentPresent;
            contact.sentExtra.setObj(obj.sentExtra);

            _me_.contactStorageList.push(contact);
          });
        }
      }).catch( (error) => {
        console.log(error);
      });
  }

  restoreRemindersFromStorage() {
    let _me_ = this;

    _me_.storage.get(_me_.recdStorageName).then((list) => {
      if(list) {
        _me_.receivedList = list;
      }
    });

    _me_.storage.get(_me_.sentStorageName).then((list) => {
      if(list) {
        _me_.sentList = list;
      }
    });
  }

}
