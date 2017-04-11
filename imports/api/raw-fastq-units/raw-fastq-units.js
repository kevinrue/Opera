import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const RawFastqUnits = new Mongo.Collection('rawFastqUnits');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('rawFastqUnits', function rawFastqUnitsPublication() {
  	return (this.userId ? RawFastqUnits.find() : []);
  })
}

Meteor.methods({

  'rawFastqUnits.clear'() {
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    RawFastqUnits.remove({});
  },

  'rawFastqUnits.insert'(listFields) {
    // file1, file2, paired, readLength, sequencer, dateRun, projectNumber, lane, notes, sampleID
    check(listFields[0], String); // file1
    check(listFields[1], String); // file2
    check(listFields[2], String); // paired
    check(listFields[3], String); // readLength
    check(listFields[4], String); // sequencer
    check(listFields[5], String); // dateRun
    check(listFields[6], String); // projectNumber
    check(listFields[7], String); // lane
    check(listFields[8], String); // notes
    check(listFields[9], String); // sampleID
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newValues = {
      file1: listFields[0],
      file2: listFields[1],
      paired: listFields[2],
      readLength: listFields[3],
      sequencer: listFields[4],
      dateRun: listFields[5],
      projectNumber: listFields[6],
      lane: listFields[7],
      notes: listFields[8],
      sampleID: listFields[9],
    };

    let recordId = RawFastqUnit.insert(
      newValues,
      (err, res) => {
        // console.log('samples.insert connection: ' + this.connection);
        if (!err){
          console.log('samples.insert: success');
          // On success, log the event
          // Meteor.call(
          //   'databaseEvents.insert',
          //   this.userId,
          //   'c', // 'create'
          //   Array(res),
          //   'rawFastqs',
          //   newValues: newValues,
          // );
        }
      }
    )

    console.log('newFileId: ' + recordId)
    return(recordId);
  },

});