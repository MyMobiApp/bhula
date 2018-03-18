import { Injectable } from '@angular/core';

/*
  Generated class for the SingletonServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SingletonServiceProvider {
  public loginState:boolean = false;
  public userAuthInfo: any = {};
  public simInfo: any = {};
  public shareAndroidMsg: string;
  public shareIOSMsg: string;
  public shareGenericMsg: string;
  public shareSubject: string;
  public playStoreURL:string = "https://goo.gl/rcv5Kv";
  public appStoreURL:string = "https://goo.gl/rcv5Kv";
  
  constructor() {
    this.shareAndroidMsg  = "Hey! I am creating my circle on Yadi App, I am forgetful ☺ and this is to let people I trust - remind me whatever they feel important to me. Please install it from Play Store at " + this.playStoreURL + " and let's remind each other 🤘.";
    this.shareIOSMsg  	  = "Hey! I am creating my circle on Yadi App, I am forgetful ☺ and this is to let people I trust - remind me whatever they feel important to me. Please install it from App Store at " + this.appStoreURL + " and let's remind each other 🤘.";
    this.shareGenericMsg  = "Hey! I am creating my circle on Yadi App, I am forgetful ☺ and this is to let people I trust - remind me whatever they feel important to me. Please install it from Play Store at " + this.playStoreURL + ", or from App Store at " + this.appStoreURL + " and let's remind each other 🤘.";

    this.shareSubject = "Come join me on Yadi App!";
  }

}
