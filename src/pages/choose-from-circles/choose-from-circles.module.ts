import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFromCirclesPage } from './choose-from-circles';

@NgModule({
  declarations: [
    ChooseFromCirclesPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseFromCirclesPage),
  ],
})
export class ChooseFromCirclesPageModule {}
