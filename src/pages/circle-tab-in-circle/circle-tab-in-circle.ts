import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WheelSelector } from '@ionic-native/wheel-selector';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';
import { CContactJSON }  from '../../contact-interfaces';
import { CirclesProvider } from '../../providers/circles/circles';

/**
 * Generated class for the CircleTabInCirclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circle-tab-in-circle',
  templateUrl: 'circle-tab-in-circle.html',
  providers: [CirclesProvider]
})
export class CircleTabInCirclePage {
  loading: boolean ;
  searchTerm: string = "";
  normalizedCircleList: CContactJSON[] = [];

  bInternetConnected: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public singletonService:SingletonServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public circles: CirclesProvider,
              private selector: WheelSelector) {
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

  ionViewDidEnter() {
    //let _me_ = this;

    //_me_.filterCircle();
  }

  filterCircle(){
    let _me_ = this;

    _me_.normalizedCircleList = _me_.circles.filterCircle(_me_.searchTerm);
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

  onSettings(forPhoneNumber: string) {
    let _me_ = this;
    

    let idx_s = _me_.singletonService.contactStorageList.findIndex(iter => iter.phoneNumber === forPhoneNumber);
    let idx_c = _me_.phoneContacts.contactList.findIndex(iter => iter.phoneNumber === forPhoneNumber);
    let idx_n = _me_.normalizedCircleList.findIndex(iter => iter.phoneNumber === forPhoneNumber);
    
    let maxVal;
    if(_me_.singletonService.contactStorageList[idx_s].circleExtra.maxReminders == -1)
    {
      maxVal = "Unlimited";
    } else {
      maxVal = _me_.singletonService.contactStorageList[idx_s].circleExtra.maxReminders;
    }

    var wheelData = {
      maxValues: [
          {description: "2"},
          {description: "3"},
          {description: "4"},
          {description: "5"},
          {description: "6"},
          {description: "7"},
          {description: "8"},
          {description: "9"},
          {description: "10"},
          {description: "Unlimited"}
      ],
      inclusionValues: [
        {description: "In Circle"},
        {description: "Mute"},
        {description: "Remove"}
      ]
    };

    _me_.selector.show({
      title: "Max Daily Reminders",
      items:[
        wheelData.maxValues,
        wheelData.inclusionValues
      ],
      theme: "dark",
      positiveButtonText: "Set",
      negativeButtonText: "Cancel",
      defaultItems: [
        {index: 0, value: maxVal},
        {index: 1, value: "In Circle"}
      ]
    }).then(
      result => {
        _me_.normalizedCircleList[idx_n].bUpdating = true;

        _me_.firestoreDBService.
        getDocumentWithID("UserCircle", _me_.singletonService.userAuthInfo.phoneNumber).then( (data) => {
          if(data != null) {
            if(data.circle) {
              let pos = data.circle.findIndex(iter => iter.phoneNumber === forPhoneNumber);

              if(pos != -1) {
                if(result[0].description == "Unlimited") {
                  data.circle[pos].maxReminders = -1;
                } else {
                  data.circle[pos].maxReminders = result[0].description;
                }

                _me_.firestoreDBService.
                updateDocument("UserCircle", _me_.singletonService.userAuthInfo.phoneNumber, data).then((value) => {
                  // Data updated.
                  _me_.phoneContacts.contactList[idx_c].circleExtra.maxReminders           = data.circle[pos].maxReminders;
                  _me_.singletonService.contactStorageList[idx_s].circleExtra.maxReminders = data.circle[pos].maxReminders;

                  _me_.filterCircle();

                  _me_.normalizedCircleList[idx_n].bUpdating = false;
                  //alert("Updated on server");
                }).catch((error) => {
                  console.log(error);
                });
              }
            }
          }
        }).catch( (error) => {
          console.log(error);
        });
      
      
    },
      err => console.log('Error: ', err)
    );

    
  }

  onReminder(forPhoneNumber: string) {
    alert("On Reminder");
  }
}
