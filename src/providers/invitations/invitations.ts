import { Injectable } from '@angular/core';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { PhoneContactsProvider } from '../../providers/phone-contacts/phone-contacts';

/*
  Generated class for the InvitationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InvitationsProvider {
  inviteList: any ;
  sentList: any;
  normilizedInviteList: any = [];

  bObjInitDone: boolean = false;
  phoneContacts: PhoneContactsProvider;
  firestoreDBService: FirestoreDBServiceProvider

  constructor() {
    console.log('Hello InvitationsProvider Provider');
  }

  initPhoneContactsAndDB(phoneContacts: PhoneContactsProvider, 
                         firestoreDBService: FirestoreDBServiceProvider) {
    if(!this.bObjInitDone) {
      this.bObjInitDone       = true;

      this.phoneContacts      = phoneContacts;
      this.firestoreDBService = firestoreDBService;
    }
  }

  sendInvite(senderPhone: string, inviteePhone: string) {
    let _me_ = this;
    let date = new Date();

    let invite = {
                phoneNumber:  senderPhone,
                sentTimestamp: date.toJSON(), // firebase.firestore.FieldValue.serverTimestamp()
                acceptedTimestamp: null,
                ignoredTimestamp: null,
                status: 0 // Invited: 0, Accepted: 1, Ignored/Rejected: 2
               };
    
    _me_.firestoreDBService.getDocumentWithID("UserInvites", inviteePhone).
    then((data) => {
      let invites = [];

      if(data != null) {
        invites = data.invites.map(x => Object.assign({}, x));

        var pos = invites.findIndex(iter => iter.phoneNumber === senderPhone);

        if(pos == -1) {
          invites.push(invite);
          
          _me_.firestoreDBService.updateDocument("UserInvites", inviteePhone, {'invites': invites}).
          then((value) => {
            alert("Invitation sent to < " + inviteePhone + " >");
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        } else {
          alert("Already invited, waiting < " + inviteePhone + " >'s response.");
        }
      }
      else {
        invites.push(invite);
        
        _me_.firestoreDBService.addDocument("UserInvites", inviteePhone, {'invites': invites}).
        then((data) => {
          _me_.updateSentList(senderPhone, inviteePhone);
        }).catch((error) => {
          alert(error);
        });
      }
    }).catch((error) => {
      alert(error);
    });
  }

  updateSentList(senderPhone: string, inviteePhone: string) {
    let _me_ = this;
    let date = new Date();

    let sentList = [];
    alert("Invitation sent to < " + inviteePhone + " >");

    let sent = {
      phoneNumber:  inviteePhone,
      sentTimestamp: date.toJSON() // firebase.firestore.FieldValue.serverTimestamp()
    };

    _me_.firestoreDBService.getDocumentWithID("UserInvites", senderPhone).
    then((data) => {
      if(data != null) {
        sentList = data.sent.map(x => Object.assign({}, x));

        var pos = sentList.findIndex(iter => iter.phoneNumber === inviteePhone);

        if(pos == -1) {
          sentList.push(sent);

          _me_.firestoreDBService.updateDocument("UserInvites", senderPhone, {'sent': sentList}).
          then((value) => {
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        }
      } else {
        sentList.push(sent);

        _me_.firestoreDBService.addDocument("UserInvites", senderPhone, {'sent': sentList}).
        then((data) => {
          // User added to sent list
        }).catch((error) => {
          alert(error);
        });
      }
    }).catch((error)=> {

    });
  }

  loadInvites(phoneNumber: string): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.firestoreDBService.dbObj.collection("UserInvites").
      doc(phoneNumber).onSnapshot((docSnapshot) => {
        if(docSnapshot.exists) {
          // docSnapshot.metadata.fromCache : true, means data is coming from cache
          // and false means from server
          _me_.inviteList = docSnapshot.data().invites ? docSnapshot.data().invites : [] ;
          _me_.sentList   = docSnapshot.data().sent ? docSnapshot.data().sent : [] ;

          _me_.normilizedInviteList = _me_.phoneContacts.mapContacts(_me_.inviteList, _me_.sentList);
        } else {
          _me_.normilizedInviteList = [];
        }
        resolve(_me_.normilizedInviteList);
      }, (error) => {
        reject(error);
      });
    });
  }

  filterInvites(searchTerm: string){
    let _me_ = this;

    return Object.assign([], _me_.normilizedInviteList.filter((item) => {
        return item.number.indexOf(searchTerm.toLowerCase()) > -1;
      }));
  }

}
