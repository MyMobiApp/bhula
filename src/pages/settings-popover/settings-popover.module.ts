import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPopoverPage } from './settings-popover';

@NgModule({
  declarations: [
    SettingsPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPopoverPage),
  ],
})
export class SettingsPopoverPageModule {}
