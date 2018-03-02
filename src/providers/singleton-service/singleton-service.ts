import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SingletonServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SingletonServiceProvider {
  public loginState:boolean = false;
  public loggedInPhoneNumber:string = "";
  
  constructor(public http: Http) {
    console.log('Hello SingletonServiceProvider Provider');
  }

}
