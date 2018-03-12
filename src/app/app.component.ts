import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { environment } from '../environments/enviroment';

import * as firebase from 'firebase';
import {enableProdMode} from '@angular/core';

import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../providers/firestore-db-service/firestore-db-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;//= LoginPage;
  @ViewChild(Nav) nav: Nav;
  
  constructor(platform: Platform, 
              statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private singletonService:SingletonServiceProvider,
              public firebaseDBService: FirestoreDBServiceProvider) {
    if(environment.production == true) {
      enableProdMode();
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.onAppReady();
      statusBar.styleDefault();
    });

    firebase.initializeApp(environment.firebaseConfig);
  }

  onAppReady(){
    let thisObj = this;

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        thisObj.singletonService.userAuthInfo = user;

        thisObj.firebaseDBService.initFirestoreDB(firebase);
        thisObj.firebaseDBService.getDocumentWithID("Users", user.phoneNumber)
        .then ((data) => {
          if(data != null) {
            // User already exists in DB, update it
            thisObj.firebaseDBService.updateDocument("Users", user.phoneNumber, user.toJSON())
            .then((data) => {
              console.log("addDocument: " + JSON.stringify(data));
            }, (error) => {
              console.log(error);
            });
          }
          else {
            // This is new user and requires to be added to the 'Users' collection
            
            thisObj.firebaseDBService.addDocument("Users", user.phoneNumber, user.toJSON())
            .then((data) => {
              console.log("addDocument: " + JSON.stringify(data));
            }, (error) => {
              console.log(error);
            });
          }
        }, (error) => {
          console.log(error);
        });
        

        console.log("user object: " + JSON.stringify(user));
        
        thisObj.nav.setRoot(TabsPage);
      } else {
        console.log("No user is signed in");

        thisObj.nav.setRoot(LoginPage);
      }

      thisObj.splashScreen.hide();
    }); 
  }
}
