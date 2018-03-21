import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { SMS } from '@ionic-native/SMS';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';

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
  filteredContactList: any    = [];
  listTimer: any ;
  searchControl: FormControl  = new FormControl();

  showSpinner: boolean        = false;
  searching: boolean          = false;
  searchTerm: string          = "";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sms: SMS,
              public singletonService:SingletonServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public popoverCtrl: PopoverController,
              public platform: Platform) {
    let _me_ = this;
    
    _me_.phoneContacts.initFirestoreAndSingleton(_me_.firestoreDBService, _me_.singletonService);
  }

  ionViewDidLoad() {
    let _me_ = this;
    _me_.showSpinner = true;
    
    _me_.phoneContacts.loadContacts().then(() => {
      _me_.filterItems();

      _me_.listTimer = setInterval(function () {
        if(_me_.phoneContacts.bListUpdated) {
          _me_.filterItems();
          
          clearInterval(_me_.listTimer);
        }
      }, 1000);

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.filterItems();
      });

      _me_.showSpinner = false;
    }).catch((error) => {
      alert(error);

      _me_.showSpinner = false;
    });
  }

  onSearchInput(){
    this.searching = true;
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

    this.filteredContactList = _me_.phoneContacts.filterItems(_me_.searchTerm);
  }

  addToCircle(phoneNumber: any) {
    alert("Adding to circle : " + phoneNumber.toString());
  }

}
