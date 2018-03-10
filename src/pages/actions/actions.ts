import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';

@Component({
  selector: 'page-about',
  templateUrl: 'actions.html'
})
export class ActionsPage {
  tokenId: string;

  constructor(public navCtrl: NavController,
              private singletonService: SingletonServiceProvider) {
    this.tokenId = singletonService.userAuthInfo.phoneNumber;

    console.log("singletonService's userAuthInfo is : ");
    console.log(singletonService.userAuthInfo);
  }

}
