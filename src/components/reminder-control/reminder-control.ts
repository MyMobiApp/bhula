import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';

import { IReminderJSON, CReminderJSON } from '../../reminder-interfaces';

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
  weekFreq: any;
  validationErrorMessage: string = "";
  reminder: CReminderJSON = new CReminderJSON();

  private datePlaceholder: string = "Pick Date";
  private timePlaceholder: string = "Pick Time";

  @Input()
  nextButtonText: string;

  @Output()
  onSelectFromCircle:EventEmitter<IReminderJSON> = new EventEmitter<IReminderJSON>();

  constructor(private datePicker: DatePicker) {
    this.reminder.date = this.datePlaceholder;
    this.reminder.time = this.timePlaceholder;
  }

  onDatePicker() {
    let _me_ = this;
    
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        _me_.reminder.date = date.toDateString();
      },
      err => alert(err)
    );
  }

  onTimePicker() {
    let _me_ = this;

    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      time => {
        _me_.reminder.time = time.toTimeString();
      },
      err => alert(err)
    );
  }

  onWeekdaySelectChange(weekFreq: any) {
    let _me_ = this;
    
    weekFreq.forEach(element => {
      switch (element) {
        case '0':
          _me_.reminder.weeklyFrequency.bSunday = true;
        break;
        case '1':
          _me_.reminder.weeklyFrequency.bMonday = true;
        break;
        case '2':
          _me_.reminder.weeklyFrequency.bTuesday = true;
        break;
        case '3':
          _me_.reminder.weeklyFrequency.bWednesday = true;
        break;
        case '4':
          _me_.reminder.weeklyFrequency.bThursday = true;
        break;
        case '5':
          _me_.reminder.weeklyFrequency.bFriday = true;
        break;
        case '6':
          _me_.reminder.weeklyFrequency.bSaturday = true;
        break;
      }
    });

    //alert(JSON.stringify(weekFreq));
  }

  /*
  Google Map API Key: AIzaSyAIQ5bdSwzgay5koRFkBksjwSfZC0WZjrQ
  */
  onNext() {
    let _me_ = this;
    let bError = false;
    //alert(JSON.stringify(_me_.reminder.toJSON()));

    _me_.validationErrorMessage = "";
    if(!_me_.reminder.title) {
      _me_.validationErrorMessage += "📑 - Title of reminder can't be empty.\n";
      bError = true;
    }

    if(!_me_.reminder.date || _me_.reminder.date === _me_.datePlaceholder) {
      _me_.validationErrorMessage += "📅 - Date of reminder must be chosen.\n";
      bError = true;
    }

    if(!_me_.reminder.time || _me_.reminder.time === _me_.timePlaceholder) {
      _me_.validationErrorMessage += "⏰ - Time of reminder must be chosen.\n";
      bError = true;
    }

    if(!bError) {
      this.onSelectFromCircle.emit(_me_.reminder);
    }
  }
}
