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
import { SettingsPopoverPage } from '../pages/settings-popover/settings-popover';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { Sim } from '@ionic-native/sim';

import { ComponentsModule } from '../components/components.module';
import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../providers/firestore-db-service/firestore-db-service';

@NgModule({
  declarations: [
    MyApp,
    ActionsPage,
    CirclesPage,
    ReminderPage,
    TabsPage,
    LoginPage,
    SettingsPopoverPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActionsPage,
    CirclesPage,
    ReminderPage,
    TabsPage,
    LoginPage,
    SettingsPopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SingletonServiceProvider,
    FirestoreDBServiceProvider,
    Firebase,
    Sim,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
