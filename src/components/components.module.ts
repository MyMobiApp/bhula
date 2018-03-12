import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PhoneLoginComponent } from './phone-login/phone-login';
import { NavbarStripComponent } from './navbar-strip/navbar-strip';

@NgModule({
	declarations: [PhoneLoginComponent,
    NavbarStripComponent],
	imports: [IonicModule],
	exports: [PhoneLoginComponent,
    NavbarStripComponent]
})
export class ComponentsModule {}
