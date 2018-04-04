export interface IInviteJSON {
    phoneNumber:  string;
    sentTimestamp: string;
    acceptedTimestamp: string;
    ignoredTimestamp: string;
    status: number; // Invited: 0, Accepted: 1, Ignored/Rejected: 2
}

export class CInviteJSON implements IInviteJSON {
  phoneNumber:  string;
  sentTimestamp: string;
  acceptedTimestamp: string;
  ignoredTimestamp: string;
  status: number; // Invited: 0, Accepted: 1, Ignored/Rejected: 2

  toJSON() {
    return {
      'phoneNumber': this.phoneNumber,
      'sentTimestamp': this.sentTimestamp,
      'acceptedTimestamp': this.acceptedTimestamp,
      'ignoredTimestamp': this.ignoredTimestamp,
      'status': this.status
    };
  }

  setObj(obj: IInviteJSON) {
    this.phoneNumber        = obj.phoneNumber;
    this.sentTimestamp      = obj.sentTimestamp ? (new Date(obj.sentTimestamp)).toLocaleString() : null ;
    this.acceptedTimestamp  = obj.acceptedTimestamp ? (new Date(obj.acceptedTimestamp)).toLocaleString() : null ;
    this.ignoredTimestamp   = obj.ignoredTimestamp ? (new Date(obj.ignoredTimestamp)).toLocaleString() : null ;
    this.status             = obj.status;
  }
}

export interface ISentJSON {
  phoneNumber:  string;
  sentTimestamp: string;
}

export class CSentJSON implements ISentJSON {
  phoneNumber:  string;
  sentTimestamp: string;

  toJSON() {
    return {
      'phoneNumber' : this.phoneNumber,
      'sentTimestamp' : this.sentTimestamp 
    };
  }

  setObj(obj: ISentJSON) {
    this.phoneNumber = obj.phoneNumber;
    this.sentTimestamp = obj.sentTimestamp ? (new Date(obj.sentTimestamp)).toLocaleString() : null ;
  }
}

export interface ICircleJSON {
  phoneNumber:        string;
  acceptedTimestamp:  string;
  minReminders:       number;
  maxReminders:       number;
  status:             number; // 0: In Circle, 1: Mute, 2: Removed
}

export class CCircleJSON implements ICircleJSON {
  phoneNumber:        string;
  acceptedTimestamp:  string;
  minReminders:       number;
  maxReminders:       number;
  status:             number  = 0;

  toJSON() {
    return {
      'phoneNumber' :       this.phoneNumber,
      'acceptedTimestamp' : this.acceptedTimestamp,
      'minReminders' :      this.minReminders,
      'maxReminders' :      this.maxReminders,
      'status' :            this.status
    };
  }

  setObj(obj: ICircleJSON) {
    this.phoneNumber = obj.phoneNumber;
    this.acceptedTimestamp = obj.acceptedTimestamp ? (new Date(obj.acceptedTimestamp)).toLocaleString() : null ;
    this.minReminders = obj.minReminders;
    this.maxReminders = obj.maxReminders;
    this.status = obj.status;
  }
}

export interface IContactJSON {
  nameObj:            any;      // JSON Object
  displayName:        string;
  phoneNumber:        string;
  emailsObjAry:       any;
  onYadi:             boolean;
  image:              any;
  bUpdating:          boolean;
  bSelected:          boolean;
  
  bInvitePresent:     boolean;
  inviteExtra:        IInviteJSON;

  bSentPresent:       boolean;
  sentExtra:          ISentJSON;

  bCirclePresent:     boolean;
  circleExtra:        ICircleJSON;
}

export class CContactJSON implements IContactJSON{
  nameObj:            any;      // JSON Object
  displayName:        string;
  phoneNumber:        string;
  emailsObjAry:       any;
  onYadi:             boolean;
  image:              any;
  bUpdating:          boolean = false;
  bSelected:          boolean = false;
  
  
  bInvitePresent:     boolean = false; // True : If inviteExtra is populated
  inviteExtra:        CInviteJSON = new CInviteJSON();

  bSentPresent:       boolean = false; // True : If sentExtra is populated
  sentExtra:          CSentJSON   = new CSentJSON();

  bCirclePresent:     boolean = false; // True : If circleExtra is populated
  circleExtra:        CCircleJSON = new CCircleJSON();

  toJSON() {
    return {
      'nameObj': JSON.stringify(this.nameObj),
      'displayName': this.displayName,
      'phoneNumber': this.phoneNumber,
      'emailsObjAry': JSON.stringify(this.emailsObjAry),
      'onYadi': this.onYadi,
      'image': this.image,
      'bUpdating': this.bUpdating,
      'bSelected' : this.bSelected,

      'bInvitePresent': this.bInvitePresent,
      'inviteExtra': this.inviteExtra.toJSON(),

      'bSentPresent': this.bSentPresent,
      'sentExtra': this.sentExtra.toJSON(),

      'bCirclePresent': this.bCirclePresent,
      'circleExtra': this.circleExtra.toJSON(),
    };
  }
}

export interface IContactForStorage {
  phoneNumber:        string;
  onYadi:             boolean;
  
  bInvitePresent:     boolean;
  inviteExtra:        IInviteJSON;

  bSentPresent:       boolean;
  sentExtra:          ISentJSON;

  bCirclePresent:     boolean;
  circleExtra:        ICircleJSON;
}

export class CContactForStorage implements IContactForStorage {
  phoneNumber:        string;
  onYadi:             boolean;
  
  bInvitePresent:     boolean = false; // True : If inviteExtra is populated
  inviteExtra:        CInviteJSON = new CInviteJSON();

  bSentPresent:       boolean = false; // True : If sentExtra is populated
  sentExtra:          CSentJSON   = new CSentJSON();

  bCirclePresent:     boolean = false; // True : If circleExtra is populated
  circleExtra:        CCircleJSON = new CCircleJSON();

  toJSON() {
    return {
      'phoneNumber': this.phoneNumber,
      'onYadi': this.onYadi,
      
      'bInvitePresent': this.bInvitePresent,
      'inviteExtra': this.inviteExtra.toJSON(),

      'bSentPresent': this.bSentPresent,
      'sentExtra': this.sentExtra.toJSON(),

      'bCirclePresent': this.bCirclePresent,
      'circleExtra': this.circleExtra.toJSON()
    };
  }
}