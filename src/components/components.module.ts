import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PhoneLoginComponent } from './phone-login/phone-login';
import { NavbarStripComponent } from './navbar-strip/navbar-strip';
import { ReminderControlComponent } from './reminder-control/reminder-control';

@NgModule({
	declarations: [PhoneLoginComponent,
    NavbarStripComponent,
    ReminderControlComponent],
	imports: [IonicModule],
	exports: [PhoneLoginComponent,
    NavbarStripComponent,
    ReminderControlComponent]
})
export class ComponentsModule {}
