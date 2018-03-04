import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PhoneLoginComponent } from './phone-login/phone-login';

@NgModule({
	declarations: [PhoneLoginComponent],
	imports: [IonicModule],
	exports: [PhoneLoginComponent]
})
export class ComponentsModule {}
