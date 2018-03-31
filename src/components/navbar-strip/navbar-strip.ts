import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { SettingsPopoverPage } from '../../pages/settings-popover/settings-popover';
import { SingletonServiceProvider } from '../../providers/singleton-service/singleton-service';

/**
 * Generated class for the ControlStripComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'navbar-strip',
  templateUrl: 'navbar-strip.html'
})
export class NavbarStripComponent {
  title: string;

  @Output()
  onAddButton: EventEmitter<void> = new EventEmitter<void>();

  constructor(private popoverCtrl: PopoverController,
              private socialSharing: SocialSharing, 
              private singletonService: SingletonServiceProvider,
              private platform: Platform) {
    this.title = singletonService.appName;
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  invite() {
    let inviteMsg ;

    if(this.platform.is('android')) {
      inviteMsg = this.singletonService.shareAndroidMsg;
    } else  if(this.platform.is('ios')) {
      inviteMsg = this.singletonService.shareIOSMsg;
    }

    this.socialSharing.share(inviteMsg, this.singletonService.shareSubject);
    //this.onAddButton.emit();
  }

}
