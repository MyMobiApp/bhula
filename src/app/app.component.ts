import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { environment } from '../environments/enviroment';

import * as firebase from 'firebase';
import { enableProdMode } from '@angular/core';

import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../providers/firestore-db-service/firestore-db-service';
import { PhoneContactsProvider } from '../providers/phone-contacts/phone-contacts';
import { CirclesProvider } from '../providers/circles/circles';
import { InvitationsProvider } from '../providers/invitations/invitations';

@Component({
  templateUrl: 'app.html',
  providers: [Firebase]
})
export class MyApp {
  rootPage:any ;//= LoginPage;
  bUserLoggedIn: boolean = false;
  
  @ViewChild(Nav) nav: Nav;
  @ViewChild('yaydiApp') navCtrl: NavController;
  
  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public phoneContacts: PhoneContactsProvider,
              public circles: CirclesProvider,
              public invitations: InvitationsProvider,
              public singletonService:SingletonServiceProvider,
              public firebaseDBService: FirestoreDBServiceProvider,
              public firebasePlugin: Firebase,
              public backgroundMode: BackgroundMode) {
    //console.dir();
    if(environment.production == true) {
      enableProdMode();
    }

    let _me_ = this;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // Enable background mode for app
      _me_.backgroundMode.enable();
      
      // Initialize Firestore DB service
      _me_.firebaseDBService.initFirestoreDB(firebase);
      // Initialize Phone Contacts Provider
      _me_.phoneContacts.initFirestoreAndSingleton(_me_.firebaseDBService, _me_.singletonService);
      _me_.invitations.initPhoneContactsAndDB(_me_.phoneContacts, _me_.firebaseDBService);
      _me_.circles.initPhoneContactsAndDB(_me_.phoneContacts, _me_.firebaseDBService);

      _me_.loadPhoneContacts();

      statusBar.styleDefault();
    });

    firebase.initializeApp(environment.firebaseConfig);
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

  onAppReady() {
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
      _me_.rootPage = TabsPage;
      //_me_.nav.setRoot(TabsPage);
      _me_.splashScreen.hide();
    }
    
    //alert(JSON.stringify(_me_.singletonService.userAuthInfo));

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        _me_.singletonService.userAuthInfo = user;
        // Initialize push notifications
        _me_.initPushNotifications();

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
        
        _me_.phoneContacts.checkContactsOnServer().then((contactList) => {
          _me_.phoneContacts.updateContactsWithCircle().then((contactList) => {
            _me_.phoneContacts.updateContactsWithInvites().then((contactList) => {
              _me_.phoneContacts.pushContactsToStorage();
            });
          });
        });

        if(!_me_.bUserLoggedIn) {
          _me_.bUserLoggedIn = true;
          _me_.rootPage = TabsPage;
          //_me_.nav.setRoot(TabsPage);
          _me_.splashScreen.hide();
        }
      } else {
        console.log("No user is signed in");

        _me_.bUserLoggedIn = false;
        _me_.rootPage = LoginPage;
        //_me_.nav.setRoot(LoginPage);
        _me_.splashScreen.hide();
      }
    });
    // ---------------------------------------
  }

  initPushNotifications(){
    let _me_ = this;

    _me_.initPushToken();
    
    _me_.subscribeToDevicePushNotifications();
    _me_.subscribeToTopicPushNotifications(_me_.singletonService.fcmPushTopicBroadcast);
    _me_.subscribeToTopicPushNotifications(_me_.singletonService.fcmPushTopicABTest);
  }

  initPushToken() {
    let _me_ = this;
    

    _me_.firebasePlugin.getToken().then(token => {
      // Your best bet is to here store the token on the user's profile on the
      // Firebase database, so that when you want to send notifications to this 
      // specific user you can do it from Cloud Functions.
      // alert(token);
      _me_.updatePushTokenInDB(token);
    });

    _me_.firebasePlugin.onTokenRefresh().subscribe(token => {
      // alert(token);
      _me_.updatePushTokenInDB(token);
    });
  }

  updatePushTokenInDB(token: any){
    let _me_ = this;
    
    _me_.firebaseDBService.
    getDocumentWithID("UserExtras", _me_.singletonService.userAuthInfo.phoneNumber).
    then((data) => {
      if(data != null) {
        if(data.fcmPushToken){
          _me_.firebaseDBService.
          updateDocument("UserExtras", _me_.singletonService.userAuthInfo.phoneNumber, {'fcmPushToken' : token}).
          then((value) => {
            // Record added
          });
        } else {
          _me_.firebaseDBService.
          addDocument("UserExtras", _me_.singletonService.userAuthInfo.phoneNumber, {'fcmPushToken' : token}).
          then((value) => {
            // Record added
          });
        }
      } else {
        _me_.firebaseDBService.
        addDocument("UserExtras", _me_.singletonService.userAuthInfo.phoneNumber, {'fcmPushToken' : token}).
        then((value) => {
          // Record added
        });
      }
    });
  }
  
  subscribeToDevicePushNotifications() {
    this.firebasePlugin.onNotificationOpen().subscribe( data => {
      if(data.wasTapped){
        //Notification was received on device tray and tapped by the user.
        alert("Notification was received on device tray and tapped by the user.");
      }else{
        //Notification was received in foreground. Maybe the user needs to be notified.
        alert("Notification was received in foreground. Maybe the user needs to be notified.");
      }
    });
  }

  subscribeToTopicPushNotifications(topic: string) {
    let _me_ = this;

    _me_.firebasePlugin.subscribe(topic).then((value) => {
      //alert(value);
    }, (error) => {
      alert("Error : " + error);
    });
  }
}
