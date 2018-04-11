import { Injectable } from '@angular/core';

/*
  Generated class for the NotificationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationServiceProvider {

  constructor() {
    /*try {
      var now = new Date().getTime();

      (<any>window).plugin.notification.local.core.setDefaults({
        led: { color: '#FF00FF', on: 500, off: 500 },
        vibrate: true
      });

      (<any>window).plugin.notification.local.core.schedule({
        id: 1,
        title: 'Ritesh has set a reminder for you',
        text: 'April 08th, 2018 - 05:30 PM',
        at: new Date(now + 30*1000),
        actions: [
          { id: 'accept', title: 'Accept', launch: true },
          { id: 'ignore', title: 'Reject', launch: true }
        ],
        foreground: true,
        priority: 1,
        sticky: true,
        sound: "file://assets/sound/lenovo_windmill_tone.mp3",
        icon: "file://assets/icon/alarm-icon-notification.ico",
        smallIcon:"file://assets/icon/alarm-icon-notification.ico"
      });

      (<any>window).plugin.notification.local.core.on('accept', function (notification, eopts) { 
        alert("On Accept");
        (<any>window).plugin.notification.local.core.cancel(1);
      });

      (<any>window).plugin.notification.local.core.on('ignore', function (notification, eopts) { 
        alert("On Ignore");
        (<any>window).plugin.notification.local.core.cancel(1);
      });
    } catch (e) {
      alert(e);
    }*/
  }

  setReminderNotification(nid: number, sTitle: string, sText: string, dateTime: Date) {
    try {
      let now = new Date();

      if(dateTime < now) {
        return;
      }
      
      (<any>window).plugin.notification.local.core.setDefaults({
        led: { color: '#FF00FF', on: 500, off: 500 },
        vibrate: true
      });

      (<any>window).plugin.notification.local.core.schedule({
        id: nid,
        title: sTitle,
        text: sText,
        at: dateTime,
        actions: [
          { id: 'snooze', title: 'Snooze', launch: true },
          { id: 'ignore', title: 'Ignore', launch: true }
        ],
        foreground: true,
        priority: 1,
        sticky: true,
        sound: "file://assets/sound/lenovo_windmill_tone.mp3",
        icon: "file://assets/icon/alarm-icon-notification.ico",
        smallIcon:"file://assets/icon/alarm-icon-notification-invert.ico"
      });

      (<any>window).plugin.notification.local.core.on('snooze', function (notification, eopts) { 
        alert("Snooze : " + JSON.stringify(eopts));
        (<any>window).plugin.notification.local.core.cancel(nid);
      });

      (<any>window).plugin.notification.local.core.on('ignore', function (notification, eopts) { 
        alert("ignore : " + JSON.stringify(eopts));
        (<any>window).plugin.notification.local.core.cancel(nid);
      });
    } catch (e) {
      alert(e);
    }
  }

  cancelNotification(id: number) {
    try {
      (<any>window).plugin.notification.local.core.cancel(id);
    } catch (e) {
      alert(e);
    }
  }

}
