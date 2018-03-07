import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { environment } from '../environments/enviroment';

import * as firebase from 'firebase';
import {enableProdMode} from '@angular/core';

import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';

@Component({
  templateUrl: 'app.html',
  providers: [SingletonServiceProvider]
})
export class MyApp {
  rootPage:any = this.singletonService.loginState ? TabsPage : LoginPage;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              singletonService:SingletonServiceProvider) {
    if(environment.production == true) {
      enableProdMode();
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.onAppReady();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onAppReady(){
    firebase.initializeApp(environment.firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.singletonService.loginState = true;
        singletonService.userAuthInfo = user;
      } else {
        // No user is signed in.
      }
    });
  }
}
