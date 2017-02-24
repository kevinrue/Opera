import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const RawFastqRecords = new Mongo.Collection('rawFastqRecords');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('rawFastqRecords', function rawFastqsPublication() {
  	return (this.userId ? RawFastqRecords.find() : []);
  })
}

Meteor.methods({
  'rawFastqs.insertSingleEnd'(filePath) {
    check(filePath, String);
    // TODO: check that filePath exists on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    RawFastqRecords.insert({
      paired: false,
      filepath: filePath,
    });
  },

  'rawFastqs.insertPairedEnd'(firstMate, secondMate) {
    check(firstMate, String);
    check(secondMate, String);
    // TODO: check that both file paths exist on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    RawFastqRecords.insert({
      paired: true,
      first: firstMate,
      second: secondMate,
    });
  },

  'rawFastqs.remove'(rawFastqId) {
    check(rawFastqId, String);
 
    RawFastqRecords.remove(rawFastqId);
  },
});