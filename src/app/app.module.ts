import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PhoneLoginComponent } from '../components/phone-login/phone-login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
 
// Firebase Settings
export const firebaseConfig = {
  apiKey: "AIzaSyCfMP7vmlj44AwaFQW-q-ccI5GB8jHTC2w",
  authDomain: "yadi-1b850.firebaseapp.com",
  databaseURL: "https://yadi-1b850.firebaseio.com",
  projectId: "yadi-1b850",
  storageBucket: "yadi-1b850.appspot.com",
  messagingSenderId: "197294891868"
};

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
    IonicModule.forRoot(MyApp)
    /*AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule*/
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
