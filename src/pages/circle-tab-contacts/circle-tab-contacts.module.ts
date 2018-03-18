import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CircleTabContactsPage } from './circle-tab-contacts';

@NgModule({
  declarations: [
    CircleTabContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(CircleTabContactsPage),
  ],
})
export class CircleTabRemainingPageModule {}
