import { Injectable } from '@angular/core';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { PhoneContactsProvider, CContactJSON, CCircleJSON } from '../../providers/phone-contacts/phone-contacts';

/*
  Generated class for the CirclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CirclesProvider {
  circleList: any;
  normilizedCircleList: CContactJSON[] = [];

  phoneContacts: PhoneContactsProvider;
  firestoreDBService: FirestoreDBServiceProvider

  constructor() {
    
  }

  initPhoneContactsAndDB(phoneContacts: PhoneContactsProvider, 
                         firestoreDBService: FirestoreDBServiceProvider) {
    this.phoneContacts      = phoneContacts;
    this.firestoreDBService = firestoreDBService;
  }

  filterCircle(searchTerm) {
    let _me_ = this;

    return Object.assign([], _me_.normilizedCircleList.filter((item) => {
      return (item.phoneNumber.indexOf(searchTerm.toLowerCase()) > -1 || item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    }));
  }

  loadCircle(phoneNumber: string): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.firestoreDBService.dbObj.collection("UserCircle").
      doc(phoneNumber).onSnapshot((docSnapshot) => {
        if(docSnapshot.exists) {
          // docSnapshot.metadata.fromCache : true, means data is coming from cache
          // and false means from server
          _me_.circleList = docSnapshot.data().circle ? docSnapshot.data().circle : [] ;

          _me_.normilizedCircleList = _me_.phoneContacts.mapCircleContacts(_me_.circleList);
        } else {
          _me_.normilizedCircleList = [];
        }
        resolve(_me_.normilizedCircleList);
      }, (error) => {
        reject(error);
      });
    });
  }

  addToCircle(senderPhone: string, inviteePhone: string) {
    let _me_ = this;
    let date = new Date();

    let circleItemSender: CCircleJSON = new CCircleJSON();
    circleItemSender.phoneNumber =  inviteePhone;
    circleItemSender.acceptedTimestamp = date.toJSON();
    circleItemSender.minReminders = 2;
    circleItemSender.maxReminders = -1;

    let circleItemInvitee: CCircleJSON = new CCircleJSON();
    circleItemInvitee.phoneNumber =  senderPhone;
    circleItemInvitee.acceptedTimestamp = date.toJSON();
    circleItemInvitee.minReminders = 2;
    circleItemInvitee.maxReminders = -1;
    
    _me_.firestoreDBService.getDocumentWithID("UserCircle", senderPhone).
    then((data) => {
      let circle = [];
      let pos;

      if(data != null) {
        if(data.circle) {
          circle = data.circle.map(x => Object.assign({}, x));
          pos = circle.findIndex(iter => iter.phoneNumber === inviteePhone);
        } else {
          pos = -1;
        }

        if(pos == -1) {
          circle.push(circleItemSender.toJSON());

          _me_.firestoreDBService.updateDocument("UserCircle", senderPhone, {'circle': circle}).
          then((value) => {
            alert("Added < " + inviteePhone + " > to your circle.");
            
            _me_.addToInviteeCircle(senderPhone, inviteePhone, circleItemInvitee);
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        } else {
          alert("< " + inviteePhone + " > is already in your circle.");
        }
      } else {
        circle.push(circleItemSender.toJSON());
        
        _me_.firestoreDBService.addDocument("UserCircle", senderPhone, {'circle': circle}).
        then((data) => {
          alert("Added < " + inviteePhone + " > to your circle.");

          _me_.addToInviteeCircle(senderPhone, inviteePhone, circleItemInvitee);
          //_me_.updateSentList(senderPhone, inviteePhone);
        }).catch((error) => {
          alert(error);
        });
      }
    }).catch( (error) => {
      alert(error);
    });
  }

  addToInviteeCircle(senderPhone: string, inviteePhone: string, circleItemInvitee: CCircleJSON) {
    let _me_ = this;
    
    _me_.firestoreDBService.getDocumentWithID("UserCircle", inviteePhone).
    then((data) => {
      let circle = [];
      let pos;

      if(data != null) {
        if(data.circle) {
          circle = data.circle.map(x => Object.assign({}, x));
          pos = circle.findIndex(iter => iter.phoneNumber === senderPhone);
        } else {
          pos = -1;
        }

        if(pos == -1) {
          circle.push(circleItemInvitee.toJSON());

          _me_.firestoreDBService.updateDocument("UserCircle", inviteePhone, {'circle': circle}).
          then((value) => {
            //alert("Added < " + senderPhone + " > to your circle.");
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        } else {
          //alert("< " + senderPhone + " > is already in your circle.");
        }
      } else {
        circle.push(circleItemInvitee.toJSON());
        
        _me_.firestoreDBService.addDocument("UserCircle", inviteePhone, {'circle': circle}).
        then((data) => {
          //alert("Added < " + senderPhone + " > to your circle.");
          //_me_.updateSentList(senderPhone, inviteePhone);
        }).catch((error) => {
          alert(error);
        });
      }
    }).catch( (error) => {
      alert(error);
    });
  }
}
