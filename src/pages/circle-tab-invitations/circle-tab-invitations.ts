import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';
import { CContactJSON } from '../../contact-interfaces';

import { InvitationsProvider } from '../../providers/invitations/invitations';
import { CirclesProvider } from '../../providers/circles/circles';

/**
 * Generated class for the CircleTabInvitationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circle-tab-invitations',
  templateUrl: 'circle-tab-invitations.html',
  providers: [InvitationsProvider, CirclesProvider]
})
export class CircleTabInvitationsPage {
  loading: boolean;
  searchTerm: string = "";
  bConnected: boolean = true;
  
  normilizedInviteList: CContactJSON[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public singletonService:SingletonServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public invitations: InvitationsProvider,
              public circles: CirclesProvider) {
    this.invitations.initPhoneContactsAndDB (phoneContacts, firestoreDBService);
    this.circles.initPhoneContactsAndDB (phoneContacts, firestoreDBService);

    this.normilizedInviteList = <CContactJSON[]>(this.phoneContacts.getUserInvitesCollectionList());

    if(this.normilizedInviteList.length == 0) {
      this.loading = true;
    }
  }

  ionViewDidLoad() {
    let _me_ = this;

    _me_.invitations.loadInvites(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
      _me_.loading = false;
      _me_.normilizedInviteList = list;
    }).catch((error) => {
      console.log(error);
    });
  }

  ionViewDidEnter() {
    //let _me_ = this;

    //_me_.filterInvites();
  }

  filterInvites(){
    let _me_ = this;

    _me_.normilizedInviteList = _me_.invitations.filterInvites(_me_.searchTerm);
  }

  refreshInvites(refresher) {
    let _me_ = this;
    _me_.bConnected = _me_.firestoreDBService.bConnected;

    if(_me_.bConnected) {
      _me_.invitations.loadInvites(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
        _me_.normilizedInviteList = list;

        refresher.complete();
      }).catch((error) => {
        console.log(error);

        refresher.complete();
      });
    }
    else {
      refresher.complete();
    }
  }

  onAccept(phoneNumber) {
    let _me_ = this;

    _me_.circles.addToCircle(_me_.singletonService.userAuthInfo.phoneNumber, phoneNumber);
    _me_.invitations.acceptInvite(_me_.singletonService.userAuthInfo.phoneNumber, phoneNumber);

    alert("Accept : " + phoneNumber);
  }

  onIgnore(phoneNumber) {
    let _me_ = this;

    _me_.invitations.ignoreInvite(_me_.singletonService.userAuthInfo.phoneNumber, phoneNumber);
    alert("Ignore : " + phoneNumber)
  }
}
