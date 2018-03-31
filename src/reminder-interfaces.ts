
export interface IWeeklyFrequency {
    bMonday:    boolean;
    bTuesday:   boolean;
    bWednesday: boolean;
    bThursday:  boolean;
    bFriday:    boolean;
    bSaturday:  boolean;
    bSunday:    boolean;
}
  
export class CWeeklyFrequency implements IWeeklyFrequency {
    bMonday:    boolean = false;
    bTuesday:   boolean = false;
    bWednesday: boolean = false;
    bThursday:  boolean = false;
    bFriday:    boolean = false;
    bSaturday:  boolean = false;
    bSunday:    boolean = false;
  
    setObj(obj: IWeeklyFrequency) {
      this.bMonday     = obj.bMonday;
      this.bTuesday    = obj.bTuesday;
      this.bWednesday  = obj.bWednesday;
      this.bThursday   = obj.bThursday;
      this.bFriday     = obj.bFriday;
      this.bSaturday   = obj.bSaturday;
      this.bSunday     = obj.bSunday;
    }
  
    toJSON(){
      return {
        'bMonday':    this.bMonday,
        'bTuesday':   this.bTuesday,
        'bWednesday': this.bWednesday,
        'bThursday':  this.bThursday,
        'bFriday':    this.bFriday,
        'bSaturday':  this.bSaturday,
        'bSunday':    this.bSunday
      };
    }
}
  
export interface IReminderJSON {
    title:        string;
    description:  string;
    date:         string;
    time:         string;
    location:     string;
  
    weeklyFrequency: IWeeklyFrequency;
}
  
export class CReminderJSON implements IReminderJSON {
    title:        string;
    description:  string;
    date:         string;
    time:         string;
    location:     string;
  
    weeklyFrequency: CWeeklyFrequency = new CWeeklyFrequency();
  
    setObj(obj: IReminderJSON){
      this.title       = obj.title;
      this.description = obj.description;
      this.date        = obj.date;
      this.time        = obj.time;
      this.location    = obj.location;
  
      this.weeklyFrequency.setObj((<CWeeklyFrequency>obj.weeklyFrequency).toJSON());
    }
  
    toJSON() {
      return {
        'title':            this.title,
        'description':      this.description,
        'date':             this.date,
        'time':             this.time,
        'location':         this.location,
        'weeklyFrequency':  this.weeklyFrequency.toJSON()
      };
    }
}