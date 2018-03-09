import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PhoneLoginComponent } from './phone-login/phone-login';
import { ControlStripComponent } from './control-strip/control-strip';

@NgModule({
	declarations: [PhoneLoginComponent,
    ControlStripComponent],
	imports: [IonicModule],
	exports: [PhoneLoginComponent,
    ControlStripComponent]
})
export class ComponentsModule {}
