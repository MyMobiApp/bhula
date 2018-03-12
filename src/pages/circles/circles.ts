import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';


@Component({
  selector: 'page-contact',
  templateUrl: 'circles.html'
})
export class CirclesPage {

  constructor(public navCtrl: NavController,
              private contacts: Contacts) {
    
  }

  onAddButton() {
    this.contacts.pickContact().then((contact) => {
        alert("Contact : " + JSON.stringify(contact));
    },(err) => {
        alert("Error : " + err);
    });

    alert("Add button clicked!");
  }

}
