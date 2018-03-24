import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { TriggersPage }             from '../pages/triggers/triggers';
import { CirclesPage }              from '../pages/circles/circles';
import { ReminderListPage }         from '../pages/reminder-list/reminder-list';
import { TabsPage }                 from '../pages/tabs/tabs';
import { LoginPage }                from '../pages/login/login';
import { SettingsPopoverPage }      from '../pages/settings-popover/settings-popover';
import { ReminderContainerPage }    from '../pages/reminder-container/reminder-container';
import { ChooseFromCirclesPage }    from '../pages/choose-from-circles/choose-from-circles';
import { CircleTabInCirclePage }    from '../pages/circle-tab-in-circle/circle-tab-in-circle';
import { CircleTabInvitationsPage } from '../pages/circle-tab-invitations/circle-tab-invitations';
import { CircleTabContactsPage }    from '../pages/circle-tab-contacts/circle-tab-contacts';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { Sim } from '@ionic-native/sim';
import { SMS } from '@ionic-native/sms';
import { DatePicker } from '@ionic-native/date-picker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { Contacts } from '@ionic-native/contacts';

import { ComponentsModule } from '../components/components.module';
import { SingletonServiceProvider } from '../providers/singleton-service/singleton-service';
import { FirestoreDBServiceProvider } from '../providers/firestore-db-service/firestore-db-service';
import { PhoneContactsProvider } from '../providers/phone-contacts/phone-contacts';
import { InvitationsProvider } from '../providers/invitations/invitations';

@NgModule({
  declarations: [
    MyApp,
    TriggersPage,
    CirclesPage,
    ReminderListPage,
    TabsPage,
    LoginPage,
    SettingsPopoverPage,
    ReminderContainerPage,
    ChooseFromCirclesPage,
    CircleTabInCirclePage,
    CircleTabInvitationsPage,
    CircleTabContactsPage
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
    TriggersPage,
    CirclesPage,
    ReminderListPage,
    TabsPage,
    LoginPage,
    SettingsPopoverPage,
    ReminderContainerPage,
    ChooseFromCirclesPage,
    CircleTabInCirclePage,
    CircleTabInvitationsPage,
    CircleTabContactsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Firebase,
    Sim,
    SMS,
    Contacts,
    DatePicker,
    SocialSharing,
    Network,
    SingletonServiceProvider,
    FirestoreDBServiceProvider,
    PhoneContactsProvider,
    InvitationsProvider
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
