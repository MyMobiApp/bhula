import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
})
export class CircleTabInCirclePage {
  searchTerm: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CircleTabInCirclePage');
  }

  filterItems(){
    let _me_ = this;

    /*this.filteredContactList = Object.assign([], this.contactList.filter((item) => {
        return item['displayName'].toLowerCase().indexOf(_me_.searchTerm.toLowerCase()) > -1;
      }));*/
    
    //alert(JSON.stringify(this.filteredContactList));
    //alert(JSON.stringify(this.contactList));
    
  }
}
