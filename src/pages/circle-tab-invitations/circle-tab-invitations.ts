import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';
import { InvitationsProvider } from '../../providers/invitations/invitations';

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
})
export class CircleTabInvitationsPage {
  loading: boolean = true;
  searchTerm: string = "";
  
  /*
  * Invite element
  * {
  *   phoneNumber:  _me_.singletonService.userAuthInfo.phoneNumber,
  *   sentTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  *   acceptedTimestamp: null,
  *   ignoredTimestamp: null,
  *   status: 0 // Invited: 0, Accepted: 1, Ignored/Rejected: 2
  * };
  */
  inviteList: any ;
  sentList: any;
  normilizedInviteList: any = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public singletonService:SingletonServiceProvider,
              public firestoreDBService: FirestoreDBServiceProvider,
              public phoneContacts: PhoneContactsProvider,
              public invitations: InvitationsProvider) {
    this.invitations.initPhoneContactsAndDB (phoneContacts, firestoreDBService);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CircleTabInvitationsPage');
  }

  ionViewDidEnter() {
    let _me_ = this;

    _me_.invitations.loadInvites(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
      _me_.loading = false;
      _me_.normilizedInviteList = list;
    }).catch((error) => {
      console.log(error);
    });
  }

  filterInvites(){
    let _me_ = this;

    _me_.normilizedInviteList = _me_.invitations.filterInvites(_me_.searchTerm);
  }

  loadInvites(): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.firestoreDBService.dbObj.collection("UserInvites").
      doc(_me_.singletonService.userAuthInfo.phoneNumber).onSnapshot((docSnapshot) => {
        if(docSnapshot.exists) {
          // docSnapshot.metadata.fromCache : true, means data is coming from cache
          // and false means from server
          _me_.inviteList = docSnapshot.data().invites ? docSnapshot.data().invites : [] ;
          _me_.sentList   = docSnapshot.data().sent ? docSnapshot.data().sent : [] ;

          alert("Invites : " + JSON.stringify(_me_.inviteList));
          alert("Sent : " + JSON.stringify(_me_.sentList));

          _me_.normilizedInviteList = _me_.phoneContacts.mapContacts(_me_.inviteList, _me_.sentList);
        } else {
          _me_.normilizedInviteList = [];
        }
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  refreshInvites(refresher) {
    let _me_ = this;

    _me_.invitations.loadInvites(_me_.singletonService.userAuthInfo.phoneNumber).then((list) => {
      _me_.normilizedInviteList = list;

      refresher.complete();
    }).catch((error) => {
      console.log(error);

      refresher.complete();
    });

  }

  onAccept(phoneNumber) {
    alert("Accept : " + phoneNumber);
  }

  onIgnore(phoneNumber) {
    alert("Ignore : " + phoneNumber)
  }
}
