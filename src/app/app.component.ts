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
import { PhoneContactsProvider } from '../providers/phone-contacts/phone-contacts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;//= LoginPage;
  bUserLoggedIn: boolean = false;

  @ViewChild(Nav) nav: Nav;
  
  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public phoneContacts: PhoneContactsProvider,
              public singletonService:SingletonServiceProvider,
              public firebaseDBService: FirestoreDBServiceProvider) {
    if(environment.production == true) {
      enableProdMode();
    }

    let _me_ = this;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Initialize Firestore DB service
      _me_.firebaseDBService.initFirestoreDB(firebase);
      // Initialize Phone Contacts Provider
      _me_.phoneContacts.initFirestoreAndSingleton(_me_.firebaseDBService, _me_.singletonService);

      _me_.loadPhoneContacts();
      statusBar.styleDefault();
    });

    firebase.initializeApp(environment.firebaseConfig);
  }

  onAppReady(){
    let _me_ = this;

    /*
     * ---------------------------------------
     * User Management
     * ---------------------------------------
     */

    // Get current logged-in user info.
    _me_.singletonService.userAuthInfo = firebase.auth().currentUser;

    if(_me_.singletonService.userAuthInfo) {
      _me_.bUserLoggedIn = true;
      _me_.nav.setRoot(TabsPage);
      _me_.splashScreen.hide();
    }
    
    //alert(JSON.stringify(_me_.singletonService.userAuthInfo));

    firebase.auth().onAuthStateChanged(user => {
      //firebase.firestore().collection("").
      if (user) {
        // User is signed in.
        _me_.singletonService.userAuthInfo = user;

        _me_.firebaseDBService.getDocumentWithID("Users", user.phoneNumber)
        .then ((data) => {
          if(data != null) {
            // User already exists in DB, update it
            _me_.firebaseDBService.updateDocument("Users", user.phoneNumber, user.toJSON())
            .then((data) => {
              console.log("addDocument: " + JSON.stringify(data));
            }, (error) => {
              console.log(error);
            });
          }
          else {
            // This is new user and requires to be added to the 'Users' collection
            
            _me_.firebaseDBService.addDocument("Users", user.phoneNumber, user.toJSON())
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
        
        if(!_me_.bUserLoggedIn) {
          _me_.bUserLoggedIn = true;
          _me_.nav.setRoot(TabsPage);
        }
      } else {
        console.log("No user is signed in");

        _me_.bUserLoggedIn = false;
        _me_.nav.setRoot(LoginPage);
      }

      _me_.splashScreen.hide();
    });
    // ---------------------------------------
  }

  loadPhoneContacts() {
    let _me_ = this;
    
    if(_me_.platform.is('android') || _me_.platform.is('ios')) {
      _me_.phoneContacts.loadContacts().then(() => {
        _me_.onAppReady();
      }).catch((error) => {
        alert(error);
      });
    } else {
      _me_.onAppReady();
    }
  }
  
}
