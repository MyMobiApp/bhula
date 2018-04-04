
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
    phoneNumber:  string; // In received list it's sender phone humber and sent list receiver phone number.
    displayName:  string; // Name of sender/receiver
    status:       number; // 0: Received/Sent, 1: Accepted, 2: Ignored, 3: Canceled by Receiver, 4: Cancel by Sender
  
    weeklyFrequency: IWeeklyFrequency;
}
  
export class CReminderJSON implements IReminderJSON {
    title:        string;
    description:  string;
    date:         string;
    time:         string;
    location:     string;
    phoneNumber:  string;
    displayName:  string;
    status:       number = 0; 
  
    weeklyFrequency: CWeeklyFrequency = new CWeeklyFrequency();
  
    setObj(obj: IReminderJSON){
      this.title       = obj.title ? obj.title : null;
      this.description = obj.description ? obj.description : null;
      this.date        = obj.date ? obj.date : null;
      this.time        = obj.time ? obj.time : null;
      this.location    = obj.location ? obj.location : null;
      this.phoneNumber = obj.phoneNumber ? obj.phoneNumber : null;
      this.displayName = obj.displayName ? obj.displayName : null;
      this.status      = obj.status ? obj.status : null;
      
      if(typeof(obj.weeklyFrequency) === typeof(CWeeklyFrequency)) {
        this.weeklyFrequency.setObj((<CWeeklyFrequency>obj.weeklyFrequency).toJSON());
      } else {
        this.weeklyFrequency.bMonday = obj.weeklyFrequency.bMonday;
        this.weeklyFrequency.bTuesday = obj.weeklyFrequency.bTuesday ;
        this.weeklyFrequency.bWednesday = obj.weeklyFrequency.bWednesday ;
        this.weeklyFrequency.bThursday = obj.weeklyFrequency.bThursday ;
        this.weeklyFrequency.bFriday = obj.weeklyFrequency.bFriday ;
        this.weeklyFrequency.bSaturday = obj.weeklyFrequency.bSaturday ;
        this.weeklyFrequency.bSunday = obj.weeklyFrequency.bSunday ;
      }
      
    }
  
    toJSON() {
      return {
        'title':            this.title,
        'description':      this.description,
        'date':             this.date,
        'time':             this.time,
        'location':         this.location,
        'phoneNumber':      this.phoneNumber,
        'status':           this.status,

        'weeklyFrequency':  this.weeklyFrequency.toJSON()
      };
    }
}