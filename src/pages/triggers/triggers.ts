import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';

@Component({
  selector: 'page-triggers',
  templateUrl: 'triggers.html'
})
export class TriggersPage {
  tokenId: string;

  constructor(public navCtrl: NavController,
              private singletonService: SingletonServiceProvider) {
    this.tokenId = singletonService.userAuthInfo.phoneNumber;
  }

}
