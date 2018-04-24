"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CWeeklyFrequency {
    constructor() {
        this.bMonday = false;
        this.bTuesday = false;
        this.bWednesday = false;
        this.bThursday = false;
        this.bFriday = false;
        this.bSaturday = false;
        this.bSunday = false;
    }
    setObj(obj) {
        this.bMonday = obj.bMonday;
        this.bTuesday = obj.bTuesday;
        this.bWednesday = obj.bWednesday;
        this.bThursday = obj.bThursday;
        this.bFriday = obj.bFriday;
        this.bSaturday = obj.bSaturday;
        this.bSunday = obj.bSunday;
    }
    toJSON() {
        return {
            'bMonday': this.bMonday,
            'bTuesday': this.bTuesday,
            'bWednesday': this.bWednesday,
            'bThursday': this.bThursday,
            'bFriday': this.bFriday,
            'bSaturday': this.bSaturday,
            'bSunday': this.bSunday
        };
    }
}
exports.CWeeklyFrequency = CWeeklyFrequency;
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus[ReminderStatus["ReceivedOrSent"] = 0] = "ReceivedOrSent";
    ReminderStatus[ReminderStatus["Accepted"] = 1] = "Accepted";
    ReminderStatus[ReminderStatus["IgnoredByReceiver"] = 2] = "IgnoredByReceiver";
    ReminderStatus[ReminderStatus["CanceledBySender"] = 3] = "CanceledBySender";
    ReminderStatus[ReminderStatus["Done"] = 4] = "Done";
})(ReminderStatus = exports.ReminderStatus || (exports.ReminderStatus = {}));
class CReminderJSON {
    constructor() {
        /*
         * Status Values
         * 0: Received/Sent,
         * 1: Accepted,
         * 2: Ignored by Receiver,
         * 3: Cancel by Sender,
         * 4: Done
         */
        this.status = 0;
        this.weeklyFrequency = new CWeeklyFrequency();
    }
    setObj(obj) {
        this.id = obj.id ? obj.id : 0;
        this.title = obj.title ? obj.title : null;
        this.description = obj.description ? obj.description : null;
        this.date = obj.date ? obj.date : null;
        this.time = obj.time ? obj.time : null;
        this.location = obj.location ? obj.location : null;
        this.phoneNumber = obj.phoneNumber ? obj.phoneNumber : null;
        this.displayName = obj.displayName ? obj.displayName : null;
        this.status = obj.status ? obj.status : null;
        if (typeof (obj.weeklyFrequency) === typeof (CWeeklyFrequency)) {
            this.weeklyFrequency.setObj(obj.weeklyFrequency.toJSON());
        }
        else {
            this.weeklyFrequency.bMonday = obj.weeklyFrequency.bMonday;
            this.weeklyFrequency.bTuesday = obj.weeklyFrequency.bTuesday;
            this.weeklyFrequency.bWednesday = obj.weeklyFrequency.bWednesday;
            this.weeklyFrequency.bThursday = obj.weeklyFrequency.bThursday;
            this.weeklyFrequency.bFriday = obj.weeklyFrequency.bFriday;
            this.weeklyFrequency.bSaturday = obj.weeklyFrequency.bSaturday;
            this.weeklyFrequency.bSunday = obj.weeklyFrequency.bSunday;
        }
    }
    toJSON() {
        return {
            'id': this.id,
            'title': this.title,
            'description': this.description,
            'date': this.date,
            'time': this.time,
            'location': this.location,
            'phoneNumber': this.phoneNumber,
            'status': this.status,
            'displayName': this.displayName,
            'weeklyFrequency': this.weeklyFrequency.toJSON()
        };
    }
}
exports.CReminderJSON = CReminderJSON;
//# sourceMappingURL=reminder-interfaces.js.map