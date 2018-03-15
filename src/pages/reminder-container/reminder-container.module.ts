import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReminderContainerPage } from './reminder-container';

@NgModule({
  declarations: [
    ReminderContainerPage,
  ],
  imports: [
    IonicPageModule.forChild(ReminderContainerPage),
  ],
})
export class ReminderContainerPageModule {}
