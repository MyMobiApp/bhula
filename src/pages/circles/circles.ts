import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CircleTabInCirclePage } from '../circle-tab-in-circle/circle-tab-in-circle';
import { CircleTabInvitationsPage } from '../circle-tab-invitations/circle-tab-invitations';
import { CircleTabContactsPage } from '../circle-tab-contacts/circle-tab-contacts';

@Component({
  selector: 'page-contact',
  templateUrl: 'circles.html'
})
export class CirclesPage {
  tab1Root = CircleTabInCirclePage;
  tab2Root = CircleTabInvitationsPage;
  tab3Root = CircleTabContactsPage;

  footerMaxHeight: number;
  
  constructor(public navCtrl: NavController) {
    
  }

  getMaximumHeight() {
    console.log(window.innerHeight);

    return (window.innerHeight / 2);
  }

  ionViewDidLoad() {
    this.footerMaxHeight = this.getMaximumHeight();
  }

  onAddButton() {
    //this.contacts.find( {fields: {"*"}})

    /*this.contacts.pickContact().then((contact) => {
        alert("Contact : " + JSON.stringify(contact));
    },(err) => {
        alert("Error : " + err);
    });*/

    alert("Add button clicked!");
  }

}
