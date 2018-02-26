import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

import {ComponentsModule} from '../../components/components.module';
import {PhoneLoginComponent} from '../../components/phone-login/phone-login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  loggedIn:boolean = false;
  
  constructor() {
    
  }
}
