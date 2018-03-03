import { Component } from '@angular/core';

import { ActionsPage } from '../actions/actions';
import { CirclesPage } from '../circles/circles';
import { ReminderPage } from '../reminder/reminder';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ReminderPage;
  tab2Root = CirclesPage;
  tab3Root = ActionsPage;

  loggedIn:boolean = false;
  
  constructor() {
    
  }
}
