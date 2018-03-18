import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { SMS } from '@ionic-native/SMS';
import { Contacts } from '@ionic-native/contacts';

import * as firebase from 'firebase';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';

/**
 * Generated class for the CircleTabRemainingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circle-tab-contacts',
  templateUrl: 'circle-tab-contacts.html',
  providers: [SMS]
})
export class CircleTabContactsPage {
  contactList:any             = [];
  filteredContactList: any    = [];

  showSpinner: boolean        = false;
  searchTerm: string          = "";
  contactsCount: number       = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public contacts: Contacts,
              public sms: SMS,
              public sanitizer: DomSanitizer,
              public singletonService:SingletonServiceProvider,
              public firebaseDBService: FirestoreDBServiceProvider,
              public popoverCtrl: PopoverController,
              public platform: Platform) {
    let _me_ = this;
    _me_.showSpinner = true;

    contacts.find(['displayName', 'name', 'phoneNumbers', 'photos', 'emails'], 
    {filter: '', hasPhoneNumber: true, multiple: true})
    .then(data => {
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

            contact["onYadi"]         = false;

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
              _me_.filteredContactList.push(contact);
            }
          }
        }
      }
      
      _me_.contactList.sort((cur, next) => (<string>cur['displayName']) < (<string>next['displayName']) ? -1 : (<string>cur['displayName']) > (<string>next['displayName']) ? 1 : 0);
      _me_.filteredContactList.sort((cur, next) => (<string>cur['displayName']) < (<string>next['displayName']) ? -1 : (<string>cur['displayName']) > (<string>next['displayName']) ? 1 : 0);
      _me_.showSpinner = false;
    }, (error) => {
      alert(error);
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CircleTabRemainingPage');
  }

  SyncUserContactsInDB() {
    let _me_ = this;

    _me_.firebaseDBService.initFirestoreDB(firebase);
    _me_.firebaseDBService.getDocumentWithID("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber)
    .then ((data) => {
      if(data != null) {
        // User already exists in DB, update it
        _me_.firebaseDBService.updateDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, JSON.stringify(_me_.contactList))
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
        
        _me_.firebaseDBService.addDocument("UserContacts", _me_.singletonService.userAuthInfo.phoneNumber, JSON.stringify(_me_.contactList))
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

  onAddOrInvite(phoneNumber: any, bOnYadi: boolean) {
    let inviteString = this.singletonService.shareGenericMsg;
    
    if(bOnYadi) {
      // On Yadi platform add to Circle
      this.addToCircle(phoneNumber);
    }
    else {
      // Send an SMS Invite
      let options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
             intent: 'INTENT'  // Opens Default sms app
            //intent: '' // Sends sms without opening default sms app
          }
      };

      this.sms.send(phoneNumber, inviteString, options).then (()=>{
        //alert("Invitation is sent to < "+ phoneNumber + " >");
      },(err)=> {
        alert("Error : " + err);
      });
    }
  }

  filterItems(){
    let _me_ = this;

    this.filteredContactList = Object.assign([], this.contactList.filter((item) => {
        return item['displayName'].toLowerCase().indexOf(_me_.searchTerm.toLowerCase()) > -1;
      }));
    
    //alert(JSON.stringify(this.filteredContactList));
    //alert(JSON.stringify(this.contactList));
    
  }

  addToCircle(phoneNumber: any) {
    alert("Adding to circle : " + phoneNumber.toString());
  }

}
