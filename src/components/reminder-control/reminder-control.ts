import { Component, Output, EventEmitter } from '@angular/core';

import { DatePicker } from '@ionic-native/date-picker';

/**
 * Generated class for the ReminderControlComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'reminder-control',
  templateUrl: 'reminder-control.html'
})
export class ReminderControlComponent {
  @Output()
  onSelectFromCircle:EventEmitter<any> = new EventEmitter<any>();

  constructor(private datePicker: DatePicker) {
    console.log('Hello ReminderControlComponent Component');
  }

  onDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => alert(date),
      err => alert(err)
    );
  }

  onTimePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      time => alert(time),
      err => alert(err)
    );
  }

  onNext() {
    let data: any = {
      "title": "Reminder",
      "description": "Description",
      "date": "18/03/2018",
      "time": "22:25:00",
      "location": "Hotel Sayaji, Indore"};

    this.onSelectFromCircle.emit(data);
  }

}
