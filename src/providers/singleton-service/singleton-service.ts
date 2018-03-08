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
  
  constructor() {
    console.log('Hello SingletonServiceProvider Provider');
  }

}
