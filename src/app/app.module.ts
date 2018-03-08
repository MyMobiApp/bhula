import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { ActionsPage } from '../pages/actions/actions';
import { CirclesPage } from '../pages/circles/circles';
import { ReminderPage } from '../pages/reminder/reminder';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { Sim } from '@ionic-native/sim';
import { IonicStorageModule } from '@ionic/storage';

import { ComponentsModule } from '../components/components.module';
import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';
import { PhoneAuthServiceProvider } from '../providers/phone-auth-service/phone-auth-service';

@NgModule({
  declarations: [
    MyApp,
    ActionsPage,
    CirclesPage,
    ReminderPage,
    TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActionsPage,
    CirclesPage,
    ReminderPage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SingletonServiceProvider,
    Firebase,
    Sim,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PhoneAuthServiceProvider
  ]
})
export class AppModule {}
