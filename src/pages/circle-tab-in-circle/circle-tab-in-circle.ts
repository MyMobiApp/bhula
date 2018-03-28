import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider, CContactJSON } from '../../providers/phone-contacts/phone-contacts';
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
  normilizedCircleList: CContactJSON[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public singletonService:SingletonServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public circles: CirclesProvider) {
    this.circles.initPhoneContactsAndDB (phoneContacts, firestoreDBService);
  }

  ionViewDidLoad() {
    let _me_ = this;
    _me_.loading = true;

    _me_.circles.loadCircle(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
      _me_.loading = false;
      _me_.normilizedCircleList = list;
    }).catch((error) => {
      console.log(error);
    });
  }

  ionViewDidEnter() {
    let _me_ = this;

    _me_.filterCircle();
  }

  filterCircle(){
    let _me_ = this;

    _me_.normilizedCircleList = _me_.circles.filterCircle(_me_.searchTerm);
  }

  refreshCircleList(refresher) {
    let _me_ = this;

    _me_.circles.loadCircle(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
      _me_.normilizedCircleList = list;

      refresher.complete();
    }).catch((error) => {
      console.log(error);

      refresher.complete();
    });

  }
}
