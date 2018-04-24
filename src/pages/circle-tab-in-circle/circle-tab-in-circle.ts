import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';

import { WheelSelector, WheelSelectorData } from '@ionic-native/wheel-selector';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';
import { CContactJSON }  from '../../contact-interfaces';
import { CirclesProvider } from '../../providers/circles/circles';

import { ReminderPopoverPage } from '../../pages/reminder-popover/reminder-popover';

/**
 * Generated class for the CircleTabInCirclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circle-tab-in-circle',
  templateUrl: 'circle-tab-in-circle.html'
})
export class CircleTabInCirclePage {
  loading: boolean ;
  searchTerm: string = "";
  normalizedCircleList: CContactJSON[] = [];

  bInternetConnected: boolean = true;
  forPhoneNumber: string = "";

  constructor(public app: App,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public singletonService:SingletonServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public circles: CirclesProvider,
              public selector: WheelSelector,
              public popoverCtrl: PopoverController) {
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

    let statusAry = ["In Circle", "Mute", "Remove"];
    let circleStatus = statusAry[_me_.singletonService.contactStorageList[idx_s].circleExtra.status] ;

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
        {description: statusAry[0]},
        {description: statusAry[1]},
        {description: statusAry[2]}
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
        {index: 1, value: circleStatus}
      ]
    }).then(
      result => {
        _me_.onWheelSuccess(result, idx_s, idx_c, idx_n, forPhoneNumber, statusAry);
      
    },
      err => console.log('Error: ', err)
    );
  }

  private onWheelSuccess(result: WheelSelectorData, 
                        idx_s: number, 
                        idx_c: number, 
                        idx_n: number,
                        forPhoneNumber: string,
                        statusAry: string[]) {
    let _me_ = this;

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

                statusAry.forEach((obj, objPos, ary) => {
                  if(obj == result[1].description) {
                    if(objPos > 0) {
                      let alert = _me_.alertCtrl.create({
                        title: 'Confirm '+result[1].description,
                        message: 'Do you want to '+result[1].description+' this contact from circle?',
                        buttons: [
                          {
                            text: 'No',
                            role: 'cancel',
                            handler: () => {
                              data.circle[pos].status = 0;
                            }
                          },
                          {
                            text: 'Yes',
                            handler: () => {
                              data.circle[pos].status = objPos;
                            }
                          }
                        ]
                      });
                      alert.present();
                    }
                  }
                }); 

                _me_.firestoreDBService.
                updateDocument("UserCircle", 
                              _me_.singletonService.userAuthInfo.phoneNumber, 
                              {'circle': data.circle}).
                then((value) => {
                  // Data updated.
                  _me_.phoneContacts.contactList[idx_c].circleExtra.maxReminders           = data.circle[pos].maxReminders;
                  _me_.singletonService.contactStorageList[idx_s].circleExtra.maxReminders = data.circle[pos].maxReminders;

                  _me_.phoneContacts.contactList[idx_c].circleExtra.status                 = data.circle[pos].status; 
                  _me_.singletonService.contactStorageList[idx_s].circleExtra.status       = data.circle[pos].status;

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
  }

  onReminder(forPhoneNumber: string) {
    this.forPhoneNumber = forPhoneNumber;
  }

  presentPopover(myEvent) {
    //alert(this.forPhoneNumber);
    try {
      this.app.getRootNav().push(ReminderPopoverPage, {"phoneNumber": this.forPhoneNumber});
    } catch (e){
      alert(e);
    }
  }
}
