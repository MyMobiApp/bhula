import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PhoneLoginComponent } from '../components/phone-login/phone-login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Firebase} from '@ionic-native/firebase';

import * as firebase from 'firebase';

import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';

// Firebase Settings
export const firebaseConfig = {
  apiKey: "AIzaSyCfMP7vmlj44AwaFQW-q-ccI5GB8jHTC2w",
  authDomain: "yadi-1b850.firebaseapp.com",
  databaseURL: "https://yadi-1b850.firebaseio.com",
  projectId: "yadi-1b850",
  storageBucket: "yadi-1b850.appspot.com",
  messagingSenderId: "197294891868"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PhoneLoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PhoneLoginComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SingletonServiceProvider,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
