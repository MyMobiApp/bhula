"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const reminder_interfaces_1 = require("../../src/reminder-interfaces");
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/*
{'id': 4, 'title': 'Test', 'description': 'Test description', 'date': '', 'time': '', 'location': '', 'phoneNumber': '+919039579039', 'status': 0, 'displayName': 'Ritesh Kanoongo', 'weeklyFrequency': {'bMonday': true, 'bTuesday': false, 'bWednesday': false, 'bThursday': false, 'bFriday': false, 'bSaturday': false, 'bSunday': false}}

sendReminderNotification({before : {'received': [{'id': 4, 'title': 'Test', 'description': 'Test description', 'date': '', 'time': '', 'location': '', 'phoneNumber': '+919039579039', 'status': 0, 'displayName': 'Ritesh Kanoongo', 'weeklyFrequency': {'bMonday': true, 'bTuesday': false, 'bWednesday': false, 'bThursday': false, 'bFriday': false, 'bSaturday': false, 'bSunday': false}}]}, after: {'received': [{'id': 4, 'title': 'Test', 'description': 'Test description', 'date': '', 'time': '', 'location': '', 'phoneNumber': '+919039579039', 'status': 0, 'displayName': 'Ritesh Kanoongo', 'weeklyFrequency': {'bMonday': true, 'bTuesday': false, 'bWednesday': false, 'bThursday': false, 'bFriday': false, 'bSaturday': false, 'bSunday': false}}]}});
*/
exports.sendReminderNotification = functions.database.ref('/UserReminders/{userUid}/').
    onWrite((change, context) => {
    const phoneNumber = context.params.userUid; // phoneNumber
    const eventData = change.after.val();
    console.log(phoneNumber);
    console.log(eventData);
    let reminderList = [];
    eventData.received.forEach((element, index) => {
        if (element.status === reminder_interfaces_1.ReminderStatus.ReceivedOrSent) {
            let reminder = new reminder_interfaces_1.CReminderJSON();
            reminder.setObj(element);
            reminderList.push(reminder);
        }
    });
    // Notification details.
    const payload = {
        notification: {
            title: 'You have got a new reminder!',
            body: 'Reminder msg'
        }
    };
    return Promise.all([
        admin.database().ref(`/users/${phoneNumber}`).once('value')
    ]).then(snapshots => {
        let ret = null;
        // Get the list of device notification tokens.
        if (snapshots[0].child("fcmPushToken").exists()) {
            const pushToken = snapshots[0].child("fcmPushToken").val();
            ret = admin.messaging().sendToDevice(pushToken, payload);
        }
        return ret;
    });
});
/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
/* exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}')
    .onWrite((change, context) => {
      const followerUid = context.params.followerUid;
      const followedUid = context.params.followedUid;
      // If un-follow we exit the function.
      if (!change.after.val()) {
        return console.log('User ', followerUid, 'un-followed user', followedUid);
      }
      console.log('We have a new follower UID:', followerUid, 'for user:', followerUid);

      // Get the list of device notification tokens.
      const getDeviceTokensPromise = admin.database()
          .ref(`/users/${followedUid}/notificationTokens`).once('value');

      // Get the follower profile.
      const getFollowerProfilePromise = admin.auth().getUser(followerUid);

      // The snapshot to the user's tokens.
      let tokensSnapshot;

      // The array containing all the user's tokens.
      let tokens;

      return Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]).then(results => {
        tokensSnapshot = results[0];
        const follower = results[1];

        // Check if there are any device tokens.
        if (!tokensSnapshot.hasChildren()) {
          return console.log('There are no notification tokens to send to.');
        }
        console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
        console.log('Fetched follower profile', follower);

        // Notification details.
        const payload = {
          notification: {
            title: 'You have a new follower!',
            body: `${follower.displayName} is now following you.`,
            icon: follower.photoURL
          }
        };

        // Listing all tokens as an array.
        tokens = Object.keys(tokensSnapshot.val());
        // Send notifications to all tokens.
        return admin.messaging().sendToDevice(tokens, payload);
      }).then((response) => {
        // For each message check if there was an error.
        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
              tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            }
          }
        });
        return Promise.all(tokensToRemove);
      });
    });

    */ 
//# sourceMappingURL=index.js.map