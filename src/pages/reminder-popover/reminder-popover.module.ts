import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReminderPopoverPage } from './reminder-popover';

@NgModule({
  declarations: [
    ReminderPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(ReminderPopoverPage),
  ],
})
export class ReminderPopoverPageModule {}
