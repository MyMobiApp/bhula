import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import {SettingsPopoverPage} from '../../pages/settings-popover/settings-popover';

/**
 * Generated class for the ControlStripComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'control-strip',
  templateUrl: 'control-strip.html'
})
export class ControlStripComponent {
  @Input()
  title: string;

  @Input()
  addButton: boolean = false;
  
  @Output()
  onAddButton: EventEmitter<void> = new EventEmitter<void>();

  constructor(public popoverCtrl: PopoverController) {
    console.log('Hello ControlStripComponent Component');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(SettingsPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  invite() {
    this.onAddButton.emit();
  }

}
