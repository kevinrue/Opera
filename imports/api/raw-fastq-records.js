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

  'rawFastqs.countRecordsSingleWithPath'(filePath) {
    check(filePath, String);
    // TODO: check that filePath exists on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    return(RawFastqRecords.find({
      paired: false,
      filepath: filePath,
    }).count());
  },

  'rawFastqs.countRecordsPairedWithPath'(filePath) {
    check(filePath, String);
    // TODO: check that filePath exists on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let count = RawFastqRecords.find({
      paired: true,
      $or: [
        {first: filePath},
        {second: filePath}
      ]
    }).count();
    // console.log('countMethod: ' + count);
 
    return(count);
  },


  'rawFastqs.countRecordsWithPath'(filePath) {
    check(filePath, String);
    // TODO: check that filePath exists on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return(
      Meteor.call('rawFastqs.countRecordsSingleWithPath', filePath) +
      Meteor.call('rawFastqs.countRecordsPairedWithPath', filePath)
    );
 
    // return(
    //   RawFastqRecords.find({
    //     paired: false,
    //     $or: [
    //       {first: filePath},
    //       {second: filePath}
    //     ]
    //   }).count())
    // );
  },

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

  'rawFastqs.insertPairedEnd'(first, second, readLength, sequencer, dateRun) {
    check(first, String);
    check(second, String);
    check(readLength, Number);
    check(sequencer, String);
    check(dateRun, String);
    // TODO: check that both file paths exist on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    RawFastqRecords.insert({
      paired: true,
      first: first,
      second: second,
      readLength: readLength,
      sequencer: sequencer,
      dateRun: dateRun,
    });
  },

  'rawFastqs.remove'(rawFastqId) {
    check(rawFastqId, String);
 
    RawFastqRecords.remove(rawFastqId);
  },
});