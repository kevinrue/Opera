import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import DatabaseLog from '../database-log/database-log.js'
 
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

    // TODO: consider performance gain using $or query
    // return(
    //   RawFastqRecords.find({
    //     paired: true,
    //     $or: [
    //       {first: filePath},
    //       {second: filePath}
    //     ]
    //   }).count())
    // );
  },

  'rawFastqs.insertSingleEnd'(filePath, readLength, sequencer, dateRun) {
    check(filePath, String);
    check(readLength, Number);
    check(sequencer, String);
    check(dateRun, Date);
    // TODO: check that filePath exists on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newValues = {
      paired: false,
      filepath: filePath,
      readLength: readLength,
      sequencerId: sequencer,
      dateRun: dateRun,
    };
 
    RawFastqRecords.insert(
      newValues,
      (err, res) => {
        // console.log('insertPairedEnd connection: ' + this.connection);
        if (!err){
          Meteor.call(
            'databaseLog.insert',
            this.userId,
            'c', // 'create'
            Array(res),
            'rawFastqs',
            newValues: newValues,
          );
        }
      }
    );
  },

  'rawFastqs.updateRecord'(recordId, newValues) {
    // console.log('rawFastqs.updateSingleEnd !');
    // console.log('typeof: ' + recordId);
    // console.log('newValues: ' + newValues);
    check(recordId, String);
    check(newValues, Object);
    // TODO: check that file path exist on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // TODO: only update (and record) necessary fields
    RawFastqRecords.update(
      recordId,
      {
        $set: newValues,
      },
      (err, res) => {
        // console.log('insertPairedEnd connection: ' + this.connection);
        if (!err){
          Meteor.call(
            'databaseLog.insert',
            this.userId,
            'u', // 'create'
            Array(recordId),
            'rawFastqs',
            newValues: newValues,
          );
        }
      }
    );
  },

  'rawFastqs.insertPairedEnd'(first, second, readLength, sequencer, dateRun) {
    check(first, String);
    check(second, String);
    check(readLength, Number);
    check(sequencer, String);
    check(dateRun, Date);
    // TODO: check that both file paths exist on the system
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newValues = {
      paired: true,
      first: first,
      second: second,
      readLength: readLength,
      sequencerId: sequencer,
      dateRun: dateRun,
    };

    RawFastqRecords.insert(
      newValues,
      (err, res) => {
        // console.log('insertPairedEnd connection: ' + this.connection);
        if (!err){
          Meteor.call(
            'databaseLog.insert',
            this.userId,
            'c', // 'create'
            Array(res),
            'rawFastqs',
            newValues: newValues,
          );
        }
      }
    );
  },

  'rawFastqs.remove'(rawFastqId) {
    check(rawFastqId, String);
 
    RawFastqRecords.remove(rawFastqId);
  },

});