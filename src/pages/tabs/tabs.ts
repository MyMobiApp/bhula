import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TriggersPage } from '../triggers/triggers';
import { CirclesPage } from '../circles/circles';
import { ReminderListPage } from '../reminder-list/reminder-list';
import { ReminderContainerPage } from '../reminder-container/reminder-container';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ReminderListPage;
  tab2Root = CirclesPage;
  tab3Root = TriggersPage;

  loggedIn:boolean = false;
  reminderCaption: string;
  
  constructor(public navCtrl: NavController) {
    this.reminderCaption = "All of your social reminders will be listed here.";
  }

  onAddReminder() {
    this.navCtrl.push(ReminderContainerPage);
  }

}
