import { Injectable } from '@angular/core';

import { FirestoreDBServiceProvider } from '../../providers/firestore-db-service/firestore-db-service';
import { PhoneContactsProvider, CContactJSON, CInviteJSON, CSentJSON } from '../../providers/phone-contacts/phone-contacts';

/*
  Generated class for the InvitationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InvitationsProvider {
  inviteList: CInviteJSON[] ;
  sentList: CSentJSON[];
  normilizedInviteList: CContactJSON[] = [];

  phoneContacts: PhoneContactsProvider;
  firestoreDBService: FirestoreDBServiceProvider

  constructor() {
    console.log('Hello InvitationsProvider Provider');
  }

  initPhoneContactsAndDB(phoneContacts: PhoneContactsProvider, 
                         firestoreDBService: FirestoreDBServiceProvider) {
    this.phoneContacts      = phoneContacts;
    this.firestoreDBService = firestoreDBService;
  }

  sendInvite(senderPhone: string, inviteePhone: string) {
    let _me_ = this;
    let date = new Date();

    let invite: CInviteJSON = new CInviteJSON();
    invite.setObj({
      phoneNumber:  senderPhone,
      sentTimestamp: date.toJSON(), // firebase.firestore.FieldValue.serverTimestamp()
      acceptedTimestamp: null,
      ignoredTimestamp: null,
      status: 0 // Invited: 0, Accepted: 1, Ignored/Rejected: 2
    })
    
    _me_.firestoreDBService.getDocumentWithID("UserInvites", inviteePhone).
    then((data) => {
      let invites = [];
      let pos;

      if(data != null) {
        if(data.invites) {
          invites = data.invites.map(x => Object.assign({}, x));
          pos = invites.findIndex(iter => iter.phoneNumber === senderPhone);
        } else {
          pos = -1;
        }

        if(pos == -1) {
          invites.push(invite);
          
          _me_.firestoreDBService.updateDocument("UserInvites", inviteePhone, {'invites': invites.map(x => x.toJSON())}).
          then((value) => {
            _me_.updateSentList(senderPhone, inviteePhone);
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
        
        _me_.firestoreDBService.addDocument("UserInvites", inviteePhone, {'invites': invites.map(x => x.toJSON())}).
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

    let sent: CSentJSON = new CSentJSON();
    sent.setObj({
      phoneNumber:  inviteePhone,
      sentTimestamp: date.toJSON() // firebase.firestore.FieldValue.serverTimestamp()
    })

    _me_.firestoreDBService.getDocumentWithID("UserInvites", senderPhone).
    then((data) => {
      let pos;

      if(data != null) {
        if(data.sent) {
          sentList = data.sent.map(x => Object.assign({}, x));
          pos = sentList.findIndex(iter => iter.phoneNumber === inviteePhone);
        } else {
          pos = -1;
        }

        if(pos == -1) {
          sentList.push(sent);

          _me_.firestoreDBService.updateDocument("UserInvites", senderPhone, {'sent': sentList.map(x => x.toJSON())}).
          then((value) => {
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        } else {
          // Already in sent list, no need to act.
        }
      } else {
        sentList.push(sent);

        _me_.firestoreDBService.addDocument("UserInvites", senderPhone, {'sent': sentList.map(x => x.toJSON())}).
        then((data) => {
          // User added to sent list
        }).catch((error) => {
          alert(error);
        });
      }
    }).catch((error)=> {
      alert(error);
    });
  }

  acceptInvite(senderPhone: string, inviteePhone: string) {
    let _me_ = this;
    let date = new Date();
    let invites = [];

    _me_.firestoreDBService.getDocumentWithID("UserInvites", senderPhone).
    then((data) => {
      if(data != null) {
        invites = data.invites.map(x => Object.assign({}, x));

        var pos = invites.findIndex(iter => iter.phoneNumber === inviteePhone);

        if(pos == -1) {
          invites[pos].acceptedTimestamp = date.toJSON();
          invites[pos].status = 1;

          _me_.firestoreDBService.updateDocument("UserInvites", senderPhone, {'invites': invites.map(x => x.toJSON())}).
          then((value) => {
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        }
      } else {
        // Record doesn't exist
      }
    }).catch((error)=> {
      alert(error);
    });
  }

  ignoreInvite(senderPhone: string, inviteePhone: string) {
    let _me_ = this;
    let date = new Date();
    let invites = [];

    _me_.firestoreDBService.getDocumentWithID("UserInvites", senderPhone).
    then((data) => {
      if(data != null) {
        invites = data.invites.map(x => Object.assign({}, x));

        var pos = invites.findIndex(iter => iter.phoneNumber === inviteePhone);

        if(pos == -1) {
          invites[pos].ignoredTimestamp = date.toJSON();
          invites[pos].status = 2;

          _me_.firestoreDBService.updateDocument("UserInvites", senderPhone, {'invites': invites.map(x => x.toJSON())}).
          then((value) => {
            //alert("addDocument: " + JSON.stringify(value));
          }, (error) => {
            alert(error);
          });
        }
      } else {
        // Record doesn't exist
      }
    }).catch((error)=> {
      alert(error);
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
          if(docSnapshot.data().invites) {
            _me_.inviteList = docSnapshot.data().invites.map(x=> {
              let obj : CInviteJSON = new CInviteJSON();
              obj.setObj(x);

              return obj; 
            });
          } else {
            _me_.inviteList = [];
          }
          
          if(docSnapshot.data().sent) {
            _me_.sentList = docSnapshot.data().sent.map( x => {
              let obj : CSentJSON = new CSentJSON();
              obj.setObj(x);

              return obj;
            });
          } else {
            _me_.sentList = [];
          }

          _me_.normilizedInviteList = _me_.phoneContacts.mapInviteContacts(_me_.inviteList, _me_.sentList);
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
        return (item.phoneNumber.indexOf(searchTerm.toLowerCase()) > -1 || item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }));
  }

}
